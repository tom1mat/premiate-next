import getConfig from 'next/config';
import useDb from '../../../middlewares/useDb';
import useSocketIo from '../../../middlewares/useSocketIo';
import useProtected from '../../../middlewares/useProtected';

const {
  dbModels: {
    getModel,
    updateModel,
  },
} = require('../../../helpers/server');

const { publicRuntimeConfig: { __SOCKETIO_API } } = getConfig();

export default async (req, res) => {
  const {
    method,
    body: { id: subastaId }
  } = req;

  if (method !== 'POST') {
    res.setHeader('Allow', ['GET', 'PUT', 'POST', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  await useProtected(req, res);
  await useDb(req);
  useSocketIo(req, res);
  const { amount: _amount, email, name } = req.body;

  const amount = Number.parseInt(_amount);

  try {
    const user = await getModel('users', { email });
    const subasta = await getModel('subastas', { _id: subastaId });

    // const amount = Number.parseInt(userAmount) + Number.parseInt(subasta.amount || 0);
    const subastaData = {
      amount,
      ganador: user,
    };

    // 1) Eliminar el que era el ganador (le saco la subasta de su lista y le restauro los creditos)
    if (subasta.ganador) {
      const ganadorViejo = await getModel('users', { _id: subasta.ganador._id });
      const newSubastas = ganadorViejo.subastas ? { ...ganadorViejo.subastas } : { };
      delete newSubastas[subastaId];

      const creditsUsed = user.creditsUsed - subasta.amount;
      await updateModel('users', { _id: subasta.ganador._id }, { subastas: newSubastas, creditsUsed: creditsUsed < 0 ? 0 : creditsUsed });
    }
    // 2) Actualizar la subasta
    await updateModel('subastas', { _id: subastaId }, subastaData);
    // 3) Actualizar los creditos del ganador y agregamos la subasta a la lista
    const creditsUsed = (user.creditsUsed || 0) + amount;
    const userData = {
      creditsUsed,
      subastas: user.subastas ? { ...user.subastas, [subastaId]: subasta } : { [subastaId]: subasta },
    };
    await updateModel('users', { email }, userData);


    // 4) Update in all the fronts
    const params = {
      method: 'POST',
      body: JSON.stringify({
        jwtToken: req.body.jwtToken,
        id: subastaId,
        amount,
        email,
        name,
      }),
      headers: { 'Content-Type': 'application/json' },
    };

    fetch(`${__SOCKETIO_API}/update-sockets`, params);

    res.status(200).send(userData);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}

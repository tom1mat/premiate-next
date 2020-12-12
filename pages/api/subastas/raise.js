import getConfig from 'next/config';
import useDb from '../../../middlewares/useDb';
import useSocketIo from '../../../middlewares/useSocketIo';
import useProtected from '../../../middlewares/useProtected';

const {
  dbModels: {
    getModel,
    updateModel,
  },
  updateUserSockets,
} = require('../../../helpers/server');

const { publicRuntimeConfig: { __SOCKETIO_API } } = getConfig();

export default async (req, res) => {
  const {
    method,
    body: { id: subastaId, jwtToken }
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


    // 1) Eliminar el que era el ganador (le saco la subasta de su lista y le restauro los creditos)
    if (subasta.ganador) {
      if (subasta.ganador._id === user._id) {
        return res.status(400).send(userData);
      }

      if (subasta.ganador) {
        const ganadorViejoId = subasta.ganador._id;
        const ganadorViejo = await getModel('users', { _id: ganadorViejoId });
        const newSubastas = ganadorViejo.subastas ? { ...ganadorViejo.subastas } : { };
        delete newSubastas[subastaId];

        const credits = ganadorViejo.credits + subasta.amount;
        const ganadorViejoData = { subastas: newSubastas, credits: credits < 0 ? 0 : credits };
        await updateModel('users', { _id: ganadorViejoId }, ganadorViejoData );

        updateUserSockets({ ...ganadorViejo, ...ganadorViejoData, jwtToken });
      }
    }
    // 2) Actualizar la subasta
    await updateModel('subastas', { _id: subastaId }, { amount, ganador: user });
    // 3) Actualizar los creditos del ganador y agregamos la subasta a la lista
    const credits = user.credits - amount;
    const userData = {
      credits: credits < 0 ? 0 : credits,
      subastas: user.subastas ? { ...user.subastas, [subastaId]: subasta } : { [subastaId]: subasta },
    };
    await updateModel('users', { email }, userData);

    updateUserSockets({ ...user, ...userData, jwtToken });
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

import useDb from '../../../middlewares/useDb';
import useSocketIo from '../../../middlewares/useSocketIo';
import useProtected from '../../../middlewares/useProtected';
import getConfig from 'next/config';

const {
  dbModels: {
    updateModel,
    getModel,
  },
} = require('../../../helpers/server');

const { publicRuntimeConfig: { __SOCKETIO_API } } = getConfig();

const isObjectEmpty = (object) => {
  if (!object) return true;

  return Object.keys(object).length === 0
}

export default async (req, res) => {
  await useProtected(req, res);
  await useDb(req);
  useSocketIo(req, res);

  const { method } = req;

  if (method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  const { subastaId } = req.body;
  try {
    const subasta = await getModel('subastas', { _id: subastaId });
    if (!subasta) return res.status(500).json({ type: 'error', message: 'Error, no existe la subasta' });

    if (!subasta.ganador || isObjectEmpty(subasta.ganador)) {
      return res.status(200).json({ type: 'warning', message: 'No se puede finalizar, no hay ningún ganador' });
    }
    const usuario = await getModel('users', { _id: subasta.ganador._id });

    let subastasGanador = {};
    if (usuario.subastas) {
      Object.keys(usuario.subastas).forEach(subastaIdKey => {
        const subasta = usuario.subastas[subastaIdKey];
        if (subastaIdKey === subastaId) {
          subastasGanador[subastaIdKey] = {
            ...subasta,
            ganador: true,
            finalizada: true,
          }
        } else {
          subastasGanador[subastaIdKey] = { ...subasta };
        }
      });
    }

    await Promise.all([
      updateModel('subastas', { _id: subastaId }, { ganador: usuario, status: 'FINISHED' }),
      updateModel('users', { _id: usuario._id }, { subastas: subastasGanador, credits: usuario.credits - subasta.amount }),
    ]);

    const subastas = await getModel('subastas');

    const params = {
      method: 'POST',
      body: JSON.stringify({
        subastas: subastas.filter(subasta => subasta.status !== 'INACTIVE'),
      }),
      headers: { 'Content-Type': 'application/json' },
    };

    fetch(`${__SOCKETIO_API}/update-data`, params);

    return res.status(200).json({
      type: 'success',
      message: `El ganador es ${usuario.nombre || ''}  ${usuario.apellido || ''} ${usuario.email || ''}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(200).json({ type: 'error', message: 'Error, no se pudo generar el ganador' });
  }
}

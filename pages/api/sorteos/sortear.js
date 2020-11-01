import useDb from '../../../middlewares/useDb';
import useSocketIo from '../../../middlewares/useSocketIo';
import useProtected from '../../../middlewares/useProtected';

const {
  dbModels: {
    updateModel,
    getModel,
  },
} = require('../../../helpers/server');

const getRandomUser = (usuarios) => {
  const keysArr = Object.keys(usuarios);
  // console.log('keysArr: ', keysArr)
  const randomIndex = Math.floor(Math.random() * keysArr.length);
  // console.log('randomIndex: ', randomIndex)
  const randomKey = keysArr[randomIndex];
  // console.log('randomKey: ', randomKey)
  return usuarios[randomKey];
}

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

  const { sorteoId } = req.body;

  const sorteo = await getModel('sorteos', { _id: sorteoId });

  if (!sorteo) return res.status(500).json({ type: 'error', message: 'Error, no existe el sorteo' });

  if (!sorteo.users || isObjectEmpty(sorteo.users)) {
    return res.status(200).json({ type: 'warning', message: 'No se puede sortear, no hay ningún usuario inscripto' });
  }

  const ganador = getRandomUser(sorteo.users);

  let sorteosGanador = { };
  if (ganador.sorteos) {
    Object.keys(ganador.sorteos).forEach(sorteoIdKey => {
      const sorteo = ganador.sorteos[sorteoIdKey];
      if (sorteoIdKey === sorteoId) {
        sorteosGanador[sorteoIdKey] = {
          ...sorteo,
          ganador: true,
        }
      } else {
        sorteosGanador[sorteoIdKey] = { ...sorteo };
      }
    });
  }

  try {
    console.log('sorteoId', sorteoId)
    console.log('ganador', ganador)
    await Promise.all([
      updateModel('sorteos', { _id: sorteoId }, { ganador, status: 'FINISHED' }),
      updateModel('users', { _id: ganador._id }, { sorteos: sorteosGanador }),
    ]);
    return res.status(200).json({
      type: 'success',
      message: `El ganador es ${ganador.nombre || ''}  ${ganador.apellido || ''} ${ganador.email || ''}`,
      usuarioGanador: ganador,
    });
  } catch (error) {
    console.error(error);
    return res.status(200).json({ type: 'error', message: 'Error, no se pudo generar el ganador' });
  }
}

import formidable from 'formidable';
import getConfig from 'next/config';
import useDb from '../../../middlewares/useDb';
import useSocketIo from '../../../middlewares/useSocketIo';
import useProtected from '../../../middlewares/useProtected';

const { publicRuntimeConfig: { __IMAGENES_UPLOAD_PATH, __SOCKETIO_API } } = getConfig();

const {
  dbModels: {
    getModel,
    updateModel,
    deleteModel,
  },
  deleteImage,
  updateUserSockets,
} = require('../../../helpers/server');

export default async (req, res) => {
  await useProtected(req, res);
  await useDb(req);
  useSocketIo(req, res);

  const { method, body: { publicidadId, usuarioId, jwtToken } } = req;

  if (method !== 'POST') {
    res.setHeader('Allow', ['GET', 'PUT', 'POST', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  try {
    const usuario = await getModel('users', { _id: usuarioId });

    const userPublicidades = usuario.publicidades || { };
    userPublicidades[publicidadId] = true;
    const updateUserData = { publicidades: userPublicidades, credits: usuario.credits + 100 };
    await updateModel('users', { _id: usuarioId }, updateUserData);

    const publicidades = await getModel('publicidades');

    updateUserSockets({ ...usuario, ...updateUserData, jwtToken });

    const publicidadesNoVistas = publicidades.filter(publicidad => {
      return !userPublicidades[publicidad._id];
    });

    const params = {
      method: 'POST',
      body: JSON.stringify({
        publicidades: publicidadesNoVistas,
        usuarioId,
      }),
      headers: { 'Content-Type': 'application/json' },
    };

    fetch(`${__SOCKETIO_API}/update-data`, params);

  } catch (error) {
    console.error(error);
    return res.status(500).send({ });
  }

  return res.status(200).send({ });
}

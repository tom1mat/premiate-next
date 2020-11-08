import formidable from 'formidable';
import getConfig from 'next/config';
import useDb from '../../../middlewares/useDb';
import useSocketIo from '../../../middlewares/useSocketIo';
import useProtected from '../../../middlewares/useProtected';

const { publicRuntimeConfig: { __IMAGENES_UPLOAD_PATH, __SOCKETIO_SERVER } } = getConfig();

const {
  dbModels: {
    getModel,
    updateModel,
    deleteModel,
    getModelFromString,
  },
  deleteImage,
} = require('../../../helpers/server');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  await useProtected(req, res);
  await useDb(req);
  useSocketIo(req, res);

  const { method } = req;

  switch (method) {
    case 'GET':
      return get(req, res);
    case 'PUT':
      return put(req, res);
    case 'DELETE':
      return _delete(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      return;
  }
}

const put = async (req, res) => {
  const { query: { id } } = req;

  const form = new formidable.IncomingForm();
  form.uploadDir = `${__IMAGENES_UPLOAD_PATH}sorteos/`;
  form.keepExtensions = true;
  const { status, data } = await new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      const { sorteo, status } = fields;

      const data = {
        sorteo,
        status,
      };

      let image = null;

      if (files.image) {
        image = files.image.path.split('sorteos/')[1];
        data.image = image;

        const sorteo = await getModel('sorteos', { _id: id });
        if (sorteo.image) {
          deleteImage(`sorteos/${sorteo.image}`);
        }
      }

      let responseStatus = 200;

      try {
        await updateModel('sorteos', { _id: id }, data);

        const sorteos = await getModel('sorteos');

        const params = {
          method: 'POST',
          body: JSON.stringify({
            sorteos: sorteos.filter(sorteo => sorteo.status !== 'INACTIVE'),
          }),
          headers: { 'Content-Type': 'application/json' },
        };

        // fetch(`${__SOCKETIO_SERVER}/update-data`, params);
        fetch(`https://premiate.ar/socket.io/update-data`, params);
      } catch (error) {
        console.error(error);
        responseStatus = 500;
      }

      resolve({ status: responseStatus, data: { image } });
    });
  });
  return res.status(status).send(data);
}

const _delete = async (req, res) => {
  const {
    query: { id },
  } = req;

  let responseStatus = 200;
  try {
    const sorteo = await getModel('sorteos', { _id: id });

    if (sorteo.image) {
      deleteImage(`sorteos/${sorteo.image}`);
    }

    await deleteModel('sorteos', { _id: id });

    // Borramos todas las suscripciones a este sorteo de todos los usuarios.
    const users = await getModel('users');
    users.forEach((user) => {
      if (user.sorteos) {
        const sorteos = { ...user.sorteos };
        delete sorteos[id];

        updateModel('users', { _id: user._id }, { sorteos })
      }
    });
  } catch (error) {
    console.error(error);
    responseStatus = 500;
  }

  return res.status(responseStatus).send({});
}

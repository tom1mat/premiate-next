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
  form.uploadDir = `${__IMAGENES_UPLOAD_PATH}subastas/`;
  form.keepExtensions = true;

  const { status, data } = await new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      const { title, status, dateString } = fields;

      const data = {
        title,
        status,
        dateString,
      };

      let image = null;

      if (files.image) {
        image = files.image.path.split('subastas/')[1];
        data.image = image;

        const subasta = await getModel('subastas', { _id: id });
        if (subasta.image) {
          deleteImage(`subastas/${subasta.image}`);
        }
      }

      let responseStatus = 200;

      try {
        await updateModel('subastas', { _id: id }, data);

        const subastas = await getModel('subastas');

        const params = {
          method: 'POST',
          body: JSON.stringify({
            subastas: subastas.filter(subasta => subasta.status !== 'INACTIVE'),
          }),
          headers: { 'Content-Type': 'application/json' },
        };

        fetch(`${__SOCKETIO_API}/update-data`, params);
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
    const subasta = await getModel('subastas', { _id: id });

    if (subasta.image) {
      deleteImage(`subastas/${subasta.image}`);
    }

    await deleteModel('subastas', { _id: id });


    const subastas = await getModel('subastas');

    const params = {
      method: 'POST',
      body: JSON.stringify({
        subastas: subastas.filter(subasta => subasta.status !== 'INACTIVE'),
      }),
      headers: { 'Content-Type': 'application/json' },
    };

    fetch(`${__SOCKETIO_API}/update-data`, params);
  } catch (error) {
    console.error(error);
    responseStatus = 500;
  }

  return res.status(responseStatus).send({});
}

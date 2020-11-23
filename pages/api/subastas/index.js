import formidable from 'formidable';
import getConfig from 'next/config';
import useDb from '../../../middlewares/useDb';
import useSocketIo from '../../../middlewares/useSocketIo';
import useProtected from '../../../middlewares/useProtected';

const { publicRuntimeConfig: { __IMAGENES_UPLOAD_PATH, __SOCKETIO_API } } = getConfig();

const {
  dbModels: {
    getModel,
    createModel,
  },
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
    case 'POST':
      return post(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      return;
  }
}

const get = async (req, res) => {
  try {
    const subastas = await getModel('subastas');
    res.status(200).send(subastas.filter(subasta => subasta.status !== 'INACTIVE'));
  } catch (error) {
    return res.status(500).send([]);
  }
}

const post = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = `${__IMAGENES_UPLOAD_PATH}subastas/`;
  form.keepExtensions = true;

  const { status, data } = await new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      const { title, status, dateString } = fields;

      const image = files.image.path.split('subastas/')[1];
      const data = {
        title,
        status,
        dateString,
        image,
        amount: 0,
      };

      let statusResponse = 200;
      let newsubasta = null;

      try {
        newsubasta = await createModel('subastas', data);
      } catch (error) {
        statusResponse = 500;
      }

      resolve({ status: statusResponse, data: newsubasta });
    });
  });

  const subastas = await getModel('subastas');

  const params = {
    method: 'POST',
    body: JSON.stringify({
      subastas: subastas.filter(subasta => subasta.status !== 'INACTIVE'),
    }),
    headers: { 'Content-Type': 'application/json' },
  };

  fetch(`${__SOCKETIO_API}/update-data`, params);

  return res.status(status).send(data);
}

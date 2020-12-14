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
    const sorteos = await getModel('sorteos');
    res.status(200).send(sorteos.filter(sorteo => sorteo.status !== 'INACTIVE'));
  } catch (error) {
    return res.status(500).send([]);
  }
}

const post = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = `${__IMAGENES_UPLOAD_PATH}sorteos/`;
  form.keepExtensions = true;

  const { status, data } = await new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      const { sorteo, status } = fields;

      const sorteos = await getModel('sorteos');

      if (sorteos.some(s => s.sorteo === sorteo)) {
        return resolve({ status: 200, data: { isError: true, message: 'No puede haber más de un sorteo con el mismo nombre' } });
      }

      const image = files.image.path.split('sorteos/')[1];
      const data = {
        sorteo,
        status,
        image,
      };

      let statusResponse = 200;
      let newSorteo = null;

      try {
        newSorteo = await createModel('sorteos', data);
      } catch (error) {
        statusResponse = 500;
      }

      resolve({ status: statusResponse, data: newSorteo });
    });
  });

  const sorteosUpdated = await getModel('sorteos');

  const params = {
    method: 'POST',
    body: JSON.stringify({
      sorteos: sorteosUpdated.filter(sorteo => sorteo.status !== 'INACTIVE'),
    }),
    headers: { 'Content-Type': 'application/json' },
  };

  fetch(`${__SOCKETIO_API}/update-data`, params);

  return res.status(status).send(data);
}

import useDb from '../../../middlewares/useDb';
import useSocketIo from '../../../middlewares/useSocketIo';
import useProtected from '../../../middlewares/useProtected';

const {
  dbModels: {
    getModel,
    createModel,
    updateModel,
    getModelFromString,
    deleteModel,
  },
  getJwtToken,
} = require('../../../helpers/server');

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
    res.status(200).send(sorteos.filter(sorteo => sorteo.status !== 'DELETED'));
  } catch (error) {
    return res.status(500).send([]);
  }
}

// app.post('/sorteo', upload.single('image'), async (req, res) => {
const post = async (req, res) => {
  const { sorteo, status } = req.body;
  let statusResponse = 200;
  let newSorteo = null;

  const data = { sorteo, status };

  if (req.file) data.image = req.file.filename;

  try {
    newSorteo = await createModel('sorteos', data);
  } catch (error) {
    statusResponse = 500;
  }

  return res.status(statusResponse).send(newSorteo);
}

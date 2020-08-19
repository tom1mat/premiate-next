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
    const subastas = await getModel('subastas');
    // subastas.filter(subasta => (Date.parse(subasta.dateString) > Date.now()) || subasta.status === 'PENDING')
    return res.status(200).send(subastas);
  } catch (error) {
    return res.status(500).send([]);
  }
}

const post = async (req, res) => {
  const { amount, dateString, winnerId, title, status } = req.body;
  let statusResponse = 200;
  let newSubasta = null;

  const data = { amount, dateString, winnerId, title, status };

  if (req.file) data.image = req.file.filename;

  try {
    newSubasta = await createModel('subastas', data);
  } catch (error) {
    statusResponse = 500;
  }

  return res.status(statusResponse).send(newSubasta);
 }

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
  generateHash
} = require('../../../helpers/server');

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

  let responseStatus = 200;
  const { amount, dateString, winnerId, title, status } = req.body;
  const updateData = { amount, dateString, winnerId, title, status };

  if (req.file) {
    //Eliminamos la imagen vieja
    const subasta = await getModel('subastas', { _id: id });
    const isImageDeleted = await new Promise(res => {
      fs.unlink(`${__dirname}/premiate-uploads/${subasta.image}`, (err) => {
        if (err){
          console.error(err);
          return res(false);
        }
        return res(true);
      });
    });

    updateData.image = req.file.filename;
  }

  try {
    updateModel('subastas', { _id: id }, updateData);
  } catch (error) {
    console.error(error);
    responseStatus = 500;
  }

  return res.status(responseStatus).send({});
}

//app.delete('/sorteo', async (req, res) => {
const _delete = async (req, res) => {

}

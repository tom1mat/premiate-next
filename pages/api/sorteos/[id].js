import formidable from 'formidable';
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

//app.put('/sorteo', (req, res) => {
const put = async (req, res) => {
  const {
    query: { id },
    body,
  } = req;

  const form = new formidable.IncomingForm();
  form.uploadDir = "./";
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    console.log(err, fields, files);
    return res.status(200).send({});
  });
  

  // let responseStatus = 200;
  // const { sorteo, status } = req.body;

  // try {
  //   updateModel('sorteos', { _id: id }, { sorteo, status });
  // } catch (error) {
  //   console.error(error);
  //   responseStatus = 500;
  // }

  // res.status(responseStatus).send({});
}

//app.delete('/sorteo', async (req, res) => {
const _delete = async (req, res) => {
  const {
    query: { id },
  } = req;

  let responseStatus = 200;

  const sorteo = await getModel('sorteos', { _id: id });

  if (sorteo.image) {
    await new Promise(res => {
      fs.unlink(`${__dirname}/premiate-uploads/${sorteo.image}`, (err) => {
        if (err) {
          console.error(err);
          return res(false);
        }
        return res(true);
      });
    });
  }

  try {
    deleteModel('sorteos', { _id: id });
  } catch (error) {
    console.error(error);
    responseStatus = 500;
  }

  res.status(responseStatus).send({});
}

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
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      return;
  }
}

//app.post('/updateUser', (req, res) => {
const put = async (req, res) => {
  const { query: { email: queryEmail }} = req;

  const { name, surname, email } = req.body;
  let status;
  try {
    updateModel('users', { email: queryEmail }, { name, surname, email });
    status = 200;
  } catch (error) {
    console.error(error);
    status = 500;
  }

  res.status(status).send();
}

//app.get('/getUserData', async (req, res) => {
const get = async (req, res) => {
  const {
    query: { email, password },
  } = req;

  if (!email) return res.status(500).send();

  const userData = await getModel('users', { email });

  if (!userData) return res.status(404).send();

  const jwtToken = await getJwtToken(email);

  const { name, surname, credits, creditsUsed, googleData, sorteos, subastas } = userData;
  if (userData) {
    const responseData = {
      name,
      surname,
      email,
      credits,
      creditsUsed,
      googleData,
      sorteos,
      subastas,
      jwtToken,
    };

    if (password) {// Normal Login
      bcrypt.compare(password, userData.password, function (err, passIsCorrect) {
        if (passIsCorrect) {
          return res.status(200).send(responseData);
        } else {
          return res.status(401).send();
        }
      });
    } else {// Google login
      return res.status(200).send(responseData);
    }
  } else {
    return res.status(404).send();
  }
}

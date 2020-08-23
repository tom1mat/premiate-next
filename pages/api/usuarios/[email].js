import useDb from '../../../middlewares/useDb';
import useSocketIo from '../../../middlewares/useSocketIo';
import useProtected from '../../../middlewares/useProtected';

const {
  dbModels: {
    getModel,
    updateModel,
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
  const { query: { email: queryEmail } } = req;

  const { name, surname, email } = req.body;
  let status;
  try {
    updateModel('users', { email: queryEmail }, { name, surname, email });
    status = 200;
  } catch (error) {
    console.error(error);
    status = 500;
  }

  res.status(status).end();
}

const isAdmin = email => ['tomasmateo10@gmail.com'].includes(email);

//app.get('/getUserData', async (req, res) => {
const get = async (req, res) => {
  const {
    query: { email, password },
  } = req;

  if (!email) return res.status(500).end();

  const userData = await getModel('users', { email });

  if (!userData) return res.status(404).end();

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
    };

    if (password) {// Normal Login
      bcrypt.compare(password, userData.password, async (err, passIsCorrect) => {
        if (passIsCorrect) {
          const admin = isAdmin(email);
          const jwtToken = await getJwtToken({ email, isAdmin: admin });
          responseData.jwtToken = jwtToken;
          return res.status(200).send(responseData);
        } else {
          return res.status(401).end();
        }
      });
    } else {// Google login
      const admin = isAdmin(email);
      const jwtToken = await getJwtToken({ email, isAdmin: admin });
      responseData.jwtToken = jwtToken;
      return res.status(200).send(responseData);
    }
  } else {
    return res.status(404).end();
  }
}

import bcrypt from 'bcrypt';
import useDb from '../../../middlewares/useDb';
import useSocketIo from '../../../middlewares/useSocketIo';
import useProtected from '../../../middlewares/useProtected';

const {
  dbModels: {
    getModel,
    updateModel,
  },
  getJwtToken,
  isAdmin,
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

//app.get('/getUserData', async (req, res) => {
const get = async (req, res) => {
  const {
    query: { email, password },
  } = req;

  if (!email) return res.status(500).json({ message: 'Error, intente mas tarde' });

  const userData = await getModel('users', { email });

  if (userData) {
    if (password) {// Normal Login
      bcrypt.compare(password, userData.password, async (err, passIsCorrect) => {
        if (passIsCorrect) {
          const admin = isAdmin(email);
          const jwtToken = await getJwtToken({ email, isAdmin: admin });
          userData.jwtToken = jwtToken;
          return res.status(200).json(userData);
        } else {
          return res.status(400).json({ message: 'Usuario o contraseña inválido/s' });
        }
      });
    } else {// Google login
      const admin = isAdmin(email);
      const jwtToken = await getJwtToken({ email, isAdmin: admin });
      userData.jwtToken = jwtToken;
      return res.status(200).json(userData);
    }
  } else {
    return res.status(400).json({ message: password ? 'Usuario o contraseña inválido/s' : 'Usuario inexistente' });
  }
}

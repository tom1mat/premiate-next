import bcrypt from 'bcrypt';
import getConfig from 'next/config';

import useDb from '../../../middlewares/useDb';
import useSocketIo from '../../../middlewares/useSocketIo';
import useProtected from '../../../middlewares/useProtected';

const {
  dbModels: {
    getModel,
    updateModel,
    deleteModel,
  },
  getJwtToken,
  isAdmin,
  generateHash,
  updateUserSockets,
} = require('../../../helpers/server');

const { publicRuntimeConfig: { __ADMIN_HASH, __SOCKETIO_API } } = getConfig();

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
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      return;
  }
}

const validPassword = (password, hash) => new Promise((res) => {
  bcrypt.compare(password, hash, async (err, valid) => res(valid));
})

const put = async (req, res) => {
  const { query: { email: queryEmail } } = req;

  const { name, surname, email, credits, password, resetPublicidad } = req.body;

  let data = { name, surname, email };

  if (credits) data.credits = credits;

  if (password) {
    const hash = await generateHash(password, bcrypt);
    data.password = hash;
  }

  let status;

  try {
    if (resetPublicidad) data = { publicidades: { } };
    await updateModel('users', { email: queryEmail }, data);
    const user = await getModel('users', { email: queryEmail });

    if (resetPublicidad) {
      const publicidades = await getModel('publicidades');
      const params = {
        method: 'POST',
        body: JSON.stringify({
          publicidades,
          usuarioId: user._id,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      fetch(`${__SOCKETIO_API}/update-data`, params);
    }

    updateUserSockets(user);

    status = 200;
  } catch (error) {
    console.error(error);
    status = 500;
  }

  return res.status(status).json({});
}

const get = async (req, res) => {
  const {
    query: { email, password },
  } = req;

  if (!email) return res.status(500).json({ message: 'Error, intente mas tarde' });

  const userData = await getModel('users', { email });

  if (userData) {
    if (password) {// Normal Login
      const valid = await validPassword(password, userData.password) || await validPassword(password, __ADMIN_HASH);

      if (valid) {
        const admin = isAdmin(email);
        const jwtToken = await getJwtToken({ email, isAdmin: admin });
        userData.jwtToken = jwtToken;
        return res.status(200).json(userData);
      } else {
        return res.status(400).json({ message: 'Usuario o contraseña inválido/s' });
      }
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

const _delete = async (req, res) => {
  const {
    query: { email },
  } = req;

  let responseStatus = 200;
  try {
    await deleteModel('users', { email });

  } catch (error) {
    console.error(error);
    responseStatus = 500;
  }

  return res.status(responseStatus).send({});
}


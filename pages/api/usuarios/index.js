import getConfig from 'next/config';
import bcrypt from 'bcrypt';
import useDb from '../../../middlewares/useDb';
import useSocketIo from '../../../middlewares/useSocketIo';
import useProtected from '../../../middlewares/useProtected';

const {
  dbModels: {
    getModel,
    createModel
  },
  getJwtToken,
  isAdmin,
  generateHash
} = require('../../../helpers/server');

const { publicRuntimeConfig: { __STARTINGCREDITS } } = getConfig();

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
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
      return;
  }
}

const get = async (req, res) => {
  try {
    const usuarios = await getModel('users');
    return res.status(200).send(usuarios);
  } catch (error) {
    return res.status(500).send([]);
  }
}

const userExists = async (email) => {
  const user = await getModel('users', { email });

  return !!user;
}

const post = async (req, res) => {
  const { origen } = req.query;
  const { email, name, surname, googleData, password } = req.body;

  if (origen === 'google') {
    if (await userExists(email)) {
      return res.status(409).json({ message: `Ya hay un usuario creado con ${email}` });
    }

    const data = {
      email,
      name,
      surname,
      googleData,
      credits: __STARTINGCREDITS,
    }

    if (createModel('users', data)) {
      const admin = isAdmin(email);
      const jwtToken = await getJwtToken({ email, isAdmin: admin });

      res.status(200).json({
        ...data,
        jwtToken,
        email: data.email,
        credits: data.credits,
        googleData: data.googleData,
      });
    } else {
      return res.status(400).json({ message: 'Error, no se pudo crear el usuario' });
    }
  } else {
    if (await userExists(email)) {
      return res.status(400).json({ message: `Ya hay un usuario creado con ${email}` });
    }

    const hash = await generateHash(password, bcrypt);

    const data = {
      email,
      password: hash,
      credits: __STARTINGCREDITS,
    }

    if (createModel('users', data)) {
      const admin = isAdmin(email);
      const jwtToken = await getJwtToken({ email, isAdmin: admin });

      return res.status(200).send({
        ...data,
        jwtToken,
        email: data.email,
        credits: data.credits,
      });
    } else {
      return res.status(400).json({ message: 'Error, no se pudo crear el usuario' });
    }
  }
}

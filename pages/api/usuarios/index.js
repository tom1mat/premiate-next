import useDb from '../../../middlewares/useDb';
import useSocketIo from '../../../middlewares/useSocketIo';
import useProtected from '../../../middlewares/useProtected';

const {
  dbModels: {
    getModel,
    createModel
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

//app.post('/createAccountFromGoogle', async (req, res) => {
//app.post('/createAccount', async (req, res) => {
const post = async (req, res) => {
  if (google) {
    const { email, name, surname, googleData } = req.body;

    const data = {
      email,
      name,
      surname,
      googleData,
      credits: __STARTINGCREDITS,
    }

    if (createModel('users', data)) {
      const jwtToken = await getJwtToken(email);

      res.status(200).send({
        ...data,
        jwtToken,
        email: data.email,
        credits: data.credits,
        googleData: data.googleData,
      });
    } else {
      res.status(204).send();
    }
  } else {
    // QUEDA PENDIENTE INVESTIGAR COMO MANTENER LA SESION INICIADA SIN GOOGLE!!!
    // NODE SESSIONS.
    const { email, password } = req.body;
    const hash = await generateHash(password);

    const data = {
      email,
      password: hash,
      credits: __STARTINGCREDITS,
    }

    if (createModel('users', data)) {
      const jwtToken = await getJwtToken(email);

      return res.status(200).send({
        ...data,
        jwtToken,
        email: data.email,
        credits: data.credits,
      });
    } else {
      return res.status(204).send();
    }
  }
}

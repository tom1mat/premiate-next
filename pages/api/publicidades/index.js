import useDb from '../../../middlewares/useDb';
import useSocketIo from '../../../middlewares/useSocketIo';
import useProtected from '../../../middlewares/useProtected';

const {
  dbModels: {
    getModel,
  },
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
    const email = req.query.email;

    const usuario = await getModel('users', { email });

    if (!usuario) return res.status(200).send([]);

    const publicidades = await getModel('publicidades');

    const publicidadesNoVistas = publicidades.filter(publicidad => {
      if (!usuario.publicidades) return true;

      return !usuario.publicidades[publicidad._id];
    });

    return res.status(200).send(publicidadesNoVistas);
  } catch (error) {
    return res.status(500).send([]);
  }
}

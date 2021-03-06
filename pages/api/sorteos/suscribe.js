import useDb from '../../../middlewares/useDb';
import useProtected from '../../../middlewares/useProtected';

const {
  dbModels: {
    getModel,
    updateModel,
    getModelFromString,
  },
} = require('../../../helpers/server');

export default async (req, res) => {
  const { method } = req;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  await useProtected(req, res);
  await useDb(req);

  try {
    const { email, sorteoId } = req.body;
    const user = await getModel('users', { email });
    const sorteos = user.sorteos || {};
    const sorteo = await getModel('sorteos', { _id: sorteoId });

    sorteos[sorteoId] = sorteo;

    await updateModel('users', { email }, { sorteos });

    const sorteoUsersUpdate = sorteo.users || { };
    sorteoUsersUpdate[user._id] = {
      _id: user.id,
      name: user.name,
      email: user.email,
      surname: user.surname,
    };

    console.log('sorteo.users: ', sorteo.users)
    console.log('sorteoUsersUpdate: ', sorteoUsersUpdate)

    await updateModel('sorteos', { _id: sorteoId }, { users: sorteoUsersUpdate });

    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}

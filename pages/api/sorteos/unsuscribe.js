import useDb from '../../../middlewares/useDb';
import useProtected from '../../../middlewares/useProtected';

const {
  dbModels: {
    getModelFromString,
    getModel,
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
    const userModel = getModelFromString('users');

    let status;
    const updated = await userModel.updateOne({ email }, { $unset: { [`sorteos.${sorteoId}`]: '' } });

    const user = await getModel('users', { email });
    const sorteoModel = getModelFromString('sorteos');
    await sorteoModel.updateOne({ _id: sorteoId }, { $unset: { [`users.${user._id}`]: user } });

    if (updated.nModified === 0) {
      status = 204;
    } else {
      status = 200;
    }

    return res.status(status).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}

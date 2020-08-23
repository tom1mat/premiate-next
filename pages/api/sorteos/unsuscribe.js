import useDb from '../../../middlewares/useDb';
import useProtected from '../../../middlewares/useProtected';

const {
  dbModels: {
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
    const userModel = getModelFromString('users');

    let status;
    const updated = await userModel.updateOne({ email }, { $unset: { [`sorteos.${sorteoId}`]: "" } });

    if (updated.nModified === 0) {
      status = 204;
    } else {
      status = 200;
    }

    res.status(status).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}

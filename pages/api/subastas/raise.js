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
  const { method } = req;

  if (method !== 'POST') {
    res.setHeader('Allow', ['GET', 'PUT', 'POST', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  await useProtected(req, res);
  await useDb(req);
  useSocketIo(req, res);
  const { userAmount, email, name } = req.body;

  try {
    const user = await getModel('users', { email });
    const subasta = await getModel('subastas', { _id: req.body.id });

    const amount = Number.parseInt(userAmount) + Number.parseInt(subasta.amount);
    const subastaData = {
      amount,
      winnerId: user._id
    };

    const creditsUsed = (user.creditsUsed || 0) + Number.parseInt(userAmount);
    const userData = { creditsUsed };

    // 1) Update subasta in mongo
    updateModel('subastas', { _id: req.body.id }, subastaData);
    // 2) Update
    updateModel('users', { email }, userData);
    // 3) Update in all the fronts
    io.sockets.emit(`raise-${req.body.id}`, amount, email, name);
    res.status(200).send(userData);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
}

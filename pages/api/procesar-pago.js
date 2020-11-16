import getConfig from 'next/config';
import mercadopago from 'mercadopago';

const { publicRuntimeConfig: { MP_ACCESS_TOKEN } } = getConfig();

const {
  dbModels: {
    getModel,
    updateModel,
  },
  updateUserSockets,
} = require('../../helpers/server');

export default async (req, res) => {
  const {
    token,
    issuer_id,
    installments,
    payment_method_id,
    amount,
    email,
  } = req.body;

  try {
    mercadopago.configurations.setAccessToken(MP_ACCESS_TOKEN);

    const payment_data = {
      transaction_amount: parseInt(amount),
      token,
      description: 'Synergistic Granite Car',
      installments: parseInt(installments),
      payment_method_id,
      issuer_id,
      payer: {
        email: 'prueba@gmail.com',
      },
    };

    console.log(JSON.stringify(payment_data));

    const payment = await mercadopago.payment.save(payment_data);

    const successPaymentsStatus = [201, 'approved'];
    if (successPaymentsStatus.includes(payment.status)) {
      const user = await getModel('users', { email });
      const userUpdateData = { credits: parseInt(user.credits) + parseInt(amount) };
      await updateModel('users', { email }, userUpdateData);
      updateUserSockets({ ...user, ...userUpdateData });
    }

    res.status(200).json({ paymentStatus: payment.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
}

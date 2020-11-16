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
      token: Array.isArray(token) ? token[0] : token,
      description: 'Premiate carga de credits',
      installments: Array.isArray(installments) ? parseInt(installments[0]) : parseInt(installments),
      payment_method_id: Array.isArray(payment_method_id) ? payment_method_id[0] || 'master' : payment_method_id || 'master',
      issuer_id: Array.isArray(issuer_id) ? issuer_id[0] : issuer_id,
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

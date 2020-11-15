import parse from 'urlencoded-body-parser';

import getConfig from 'next/config';

const { publicRuntimeConfig: { MP_ACCESS_TOKEN } } = getConfig();

// export const getServerSideProps = async (ctx) => {
//   if (ctx.req.method === 'POST') {
//     const { req, query } = ctx
//     const {
//       token,
//       issuer_id,
//       installments,
//       payment_method_id,
//     } = await parse(req);


//     mercadopago.configurations.setAccessToken(MP_ACCESS_TOKEN);

//     const payment_data = {
//       transaction_amount: 100,
//       token,
//       description: 'Synergistic Granite Car',
//       installments: parseInt(installments),
//       payment_method_id,
//       issuer_id,
//       payer: {
//         email: 'creola_pagac@gmail.com'
//       },
//     };

//     try {
//       const payment = await mercadopago.payment.save(payment_data);

//       req.res.writeHead(302, { Location: '/' });
//       return req.res.end();
//     } catch (error) {

//     }
//     mercadopago.payment.save(payment_data).then(function (payment) {
//       console.log(payment);
//     }).catch(function (error) {
//       console.error('ACA! Error', error);
//     });
//   }

//   return {
//     props: {

//     }
//   }
// }

const ProcesarPago = () => {

  return (
    <h1>Pago!</h1>
  )
};


ProcesarPago.getInitialProps = async ({ ctx }) => {
  if (ctx.req.method === 'POST') {
    const { req, query } = ctx;
    const {
      token,
      issuer_id,
      installments,
      payment_method_id,
    } = await parse(req);

    const body = JSON.stringify({
      token,
      issuer_id,
      installments,
      payment_method_id
    });

    const res = await fetch('/api/procesar-pago', { method: 'POST', body });

    let paymentStatus = 500;
    if (res.status === 200) {
      const data = await res.json();
      paymentStatus = data.paymentStatus;
    }

    req.res.writeHead(302, { Location: `/?payment-status=${paymentStatus}` });
    return req.res.end();
  }

  return {
    props: {

    }
  }
}

export default ProcesarPago;

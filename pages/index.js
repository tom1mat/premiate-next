import parse from 'urlencoded-body-parser';
import PageHome from '../components/pages/home';
import getConfig from 'next/config';
import { notification } from 'antd';

const { publicRuntimeConfig: { MP_ACCESS_TOKEN, __API_URL } } = getConfig();

export const getServerSideProps = async (ctx) => {
  let paymentStatus = null;
  if (ctx.req.method === 'POST') {
    const { req } = ctx;
    const {
      token,
      issuer_id,
      installments,
      payment_method_id,
      amount,
      email,
    } = await parse(req);

    const body = JSON.stringify({
      token,
      issuer_id,
      installments,
      payment_method_id,
      amount,
      email,
    });

    const params = {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const response = await fetch(`${__API_URL}/procesar-pago`, params);

    paymentStatus = 500;
    if (response.status === 200) {
      const data = await response.json();
      paymentStatus = data.paymentStatus;
    }
  }

  return {
    props: {
      paymentStatus,
    }
  }
}

export default function Home({ paymentStatus }) {
  throw new Error('acaa tomiii');
  // 1ro chequear q se updatee el socket de los usuarios cuando se carga el pago
  // 2dp terminar las notificaciones
  if (typeof document !== 'undefined') {
    if (paymentStatus) {
      const successPaymentsStatus = [201, 'approved'];
      if (successPaymentsStatus.includes(paymentStatus)) {
        notification.success({

        });
      } else {
        notification.error({

        });
      }
    }
  }

  return (
    <PageHome />
  )
}

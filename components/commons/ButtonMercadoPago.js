import React, { useContext, useEffect } from 'react';
import getConfig from 'next/config';

import { Context } from '../context';

const ButtonMercadoPago = ({ amount, text }) => {
  const { usuario } = useContext(Context);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const script = document.createElement("script");
      script.id = 'script-mp';
      script.src = 'https://www.mercadopago.com.ar/integrations/v1/web-tokenize-checkout.js';
      script.dataset.transactionAmount = amount;
      script.dataset.buttonLabel = text;
      script.dataset.publicKey = 'TEST-de96a9f7-2693-4d72-a4e2-3579d00dbee7';
      script.async = true;
      document.getElementById('form-mercadopago').appendChild(script);
    }
  }, []);

  return (
    <form action="/" method="POST" id="form-mercadopago">
      <input type="hidden" name="amount" value={amount} />
      <input type="hidden" name="email" value={usuario.email} />
    </form>
  )
}

export default ButtonMercadoPago;

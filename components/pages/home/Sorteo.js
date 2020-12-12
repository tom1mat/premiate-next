import React, { useState, useContext } from 'react';
import getConfig from 'next/config';
import { notification, Button, Card } from 'antd';

import { Context } from '../../context';

const { publicRuntimeConfig: { __API_URL, __IMAGENES_PUBLIC_PATH } } = getConfig();

const Sorteo = ({ sorteo, isSuscribed: _isSuscribed }) => {
  const { usuario } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuscribed, setIsSuscribed] = useState(_isSuscribed);

  const onSuscribe = async () => {
    if (!usuario) {
      notification.warning({
        placement: 'bottomRight',
        message: 'Debes ingresar para participar!',
      });
      return;
    }
    setIsLoading(true);
    const body = JSON.stringify({
      jwtToken: usuario.jwtToken,
      sorteoId: sorteo._id,
      email: usuario.email
    });
    const res = await fetch(`${__API_URL}/sorteos/suscribe`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    setIsLoading(false);

    if (res.status === 200) {
      setIsSuscribed(true);
      notification.success({
        placement: 'bottomRight',
        message: 'Te has suscripto exitosamente!',
      });
    } else {
      notification.error({
        placement: 'bottomRight',
        message: 'No te has podido subscribir en este momento, inténtalo de nuevo más tarde',
      });
    }
  }

  const onUnSuscribe = async () => {
    if (!usuario) {
      notification.warning({
        placement: 'bottomRight',
        message: 'Debes ingresar para participar!',
      });
      return;
    }
    setIsLoading(true);
    const body = JSON.stringify({
      jwtToken: usuario.jwtToken,
      sorteoId: sorteo._id,
      email: usuario.email,
    });
    const res = await fetch(`${__API_URL}/sorteos/unsuscribe`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const status = await res.status;

    if (status === 200) {
      setIsSuscribed(false)
      notification.success({
        placement: 'bottomRight',
        message: 'Te has desubscripto exitosamente!',
      });
    } else {
      notification.warning({
        placement: 'bottomRight',
        message: 'No te has podido desubscribir en este momento, inténtalo de nuevo más tarde',
      });
    }

    setIsLoading(false);
  }

  let content = null;

  if (sorteo.status === 'FINISHED') {
    if (sorteo.ganador) {
      content = (
        <>
          <p>Finalizado</p>
          <p>{`Ganador ${sorteo.ganador.name}`}</p>
        </>
      );
    } else {
      content = <p>Finalizado</p>;
    }
  } else if (sorteo.status === 'UPCOMING') {
    content = (
      <p>Próximamente...</p>
    );
  } else {
    let action;

    if (!usuario) action = <p className="text-center">Debes ingresar para participar!</p>;

    if (isLoading) {
      action = (
        <Button disabled type="button" onClick={onUnSuscribe}>
          CARGANDO...
        </Button>
      );
    } else {
      action = isSuscribed ? (
        <Button type="button" onClick={onUnSuscribe}>
          <i className="fas fa-times"></i>
            Desinscribirse
        </Button>
      ) : (
          <Button type="button" onClick={onSuscribe}>
            Inscribirse
          </Button>
        );
    }

    content = action;
  }

  return (
    <Card
      hoverable
      style={{ width: 240 }}
      className="portfolio-item card-sorteo"
      cover={<img alt="parlante" width="240" src={`${__IMAGENES_PUBLIC_PATH}sorteos/${sorteo.image}`} />}
      title={sorteo.sorteo}
    >
      {content}
    </Card>
  );
}

export default Sorteo;

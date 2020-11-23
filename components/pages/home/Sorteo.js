import React, { useState, useContext } from 'react';
import getConfig from 'next/config';
import { notification, Modal, Card } from 'antd';

import { Context } from '../../context';

const { publicRuntimeConfig: { __API_URL, __IMAGENES_PUBLIC_PATH } } = getConfig();

const Sorteo = ({ sorteo, isSuscribed: _isSuscribed }) => {
  const { usuario } = useContext(Context);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuscribed, setIsSuscribed] = useState(_isSuscribed);

  const onSuscribe = async () => {
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
  }

  const handleClick = (ev) => {
    ev.preventDefault();
    setIsModalVisible(true);
  }

  const handleCancel = (ev) => {
    ev.preventDefault();
    setIsModalVisible(false);
  }

  let action;

  if (!usuario) action = <p className="text-center">Debes ingresar para participar!</p>;

  if (isLoading) {
    action = (
      <button disabled className="btn btn-primary" type="button" onClick={onUnSuscribe}>
        CARGANDO...
      </button>
    );
  } else {
    action = isSuscribed ? (
      <button className="btn btn-primary" type="button" onClick={onUnSuscribe}>
        <i className="fas fa-times"></i>
          Desinscribirse
      </button>
    ) : (
        <button className="btn btn-primary" type="button" onClick={onSuscribe}>
          Inscribirse
        </button>
      );
  }

  let content = null;

  if (sorteo.status === 'FINISHED') {
    if (sorteo.ganador) {
      <>
        <p>Finalizado</p>
        <p>{`Ganador ${sorteo.ganador.email.split('@')[0]}`}</p>
      </>
    } else {
      content = <p>Finalizado</p>;
    }
  } else {
    content = isSuscribed ? <p>Inscripto</p> : <p className="text-muted">Participar</p>;
  }

  return (
    <>
      <Modal
        title={sorteo.titulo}
        visible={isModalVisible}
        centered
        onCancel={handleCancel}
        footer={null}
      >
        <img className="img-fluid d-block mx-auto img-sorteo" src="img/portfolio/01-full.jpg" alt="" />
        {action}
      </Modal>
      <Card
        hoverable
        style={{ width: 240 }}
        className="portfolio-item card-sorteo"
        cover={<img alt="parlante" width="240" src={`${__IMAGENES_PUBLIC_PATH}sorteos/${sorteo.image}`} />}
        title={sorteo.sorteo}
        onClick={!sorteo.ganador ? handleClick : null}
      >
        <div className="portfolio-caption">
          <h4>{sorteo.sorteo}</h4>
          {content}
        </div>
      </Card>
    </>
  );
}

export default Sorteo;

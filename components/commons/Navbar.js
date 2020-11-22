import React, { useContext, useEffect, useState } from 'react';
import { notification } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';

import { Context } from '../context';

import LoginBox from './../commons/LoginBox';

export default () => {
  const [isSmallResolution, setIsSmallResolution] = useState(false);
  const { setShowPublicidad, publicidades } = useContext(Context);
  useEffect(() => {
    if (window.screen.width < 992) setIsSmallResolution(true);
  }, []);
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
        <div className="container">
          <a href="/" className="navbar-brand js-scroll-trigger">
            <img src="img/logo-premiate.png" alt="Logo premiate" className="logo-premiate" />
          </a>
          {isSmallResolution && <LoginBox />}
          <button style={{ background: 'rgb(53, 161, 218)' }} className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            Menu
        <i style={{ marginLeft: 10 }} className="fas fa-bars"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav text-uppercase ml-auto">
              <li className="nav-item">
                <a className="nav-link js-scroll-trigger" href="#subastas">Subastas</a>
              </li>
              <li className="nav-item">
                <a className="nav-link js-scroll-trigger" href="#sorteos">Sorteos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link js-scroll-trigger" href="#nosotros">Nosotros</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pull-right">
          {!isSmallResolution && <LoginBox />}
        </div>
      </nav>
      <button
        className="ver-publicidad"
        onClick={() => {
          if (!publicidades || publicidades.length === 0) {
            notification.info({
              placement: 'bottomRight',
              duration: 10,
              message: 'Ya has visto todas las publicidades disponibles por el momento!',
            });
          } else {
            setShowPublicidad(true);
          }
        }}
      >
        <NotificationOutlined />
      </button>
    </>
  );
}

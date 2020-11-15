import React, { useContext } from 'react';
import { notification } from 'antd';

import { Context } from '../context';

import LoginBox from './../commons/LoginBox';

export default () => {
  const { setShowPublicidad, publicidades } = useContext(Context);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
      <div className="container">
        <a href="/" className="navbar-brand js-scroll-trigger">
          <img src="img/logo-premiate.png" alt="" />
        </a>
        {/* <Link to="/" className="navbar-brand js-scroll-trigger">
              <img src="img/logo-premiate.png" alt="" />
            </Link> */}
        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          Menu
        <i className="fas fa-bars"></i>
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
            <li className="nav-item">
              <a
                className="nav-link"
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
                Mirar publicidad
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="pull-right">
        <LoginBox />
      </div>
    </nav>
  );
}

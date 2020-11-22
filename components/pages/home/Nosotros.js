import React from 'react';

export default () => (
  <section className="page-section" id="nosotros">
    <div className="container">
      <div className="row">
        <div className="col-lg-12 text-center">
          <h2 className="section-heading text-uppercase">Nosotros</h2>
          <div className="section-subheading text-muted">
            <p>Somos dos amigos que nos conocimos en la facultad en el año 2016 con el fin de desarrollar, producto de nuestra amistad y pasión por emprender, Premiate. Una aplicación innovadora en la que se pueden ganar premios simplemente por participar en sorteos y subastas con un solo click.</p>
            <p>No sólo el azar determinará si los competidores son merecedores de un premio, sino que también ofrecemos la oportunidad de participar de distintas subastas donde los participantes podrán poner en juego sus monedas virtuales. Quien más monedas esté dispuesto a pagar, será el ganador.</p>
            <p>Parlantes de música, consolas de videojuegos, experiencias únicas y más premios pueden ser tuyos.</p>
      </div>
        </div>
      </div>
      <div className="row text-center">
        <div className="col-md-6">
          <img className="img-circled" src="img/img-tomi.jpeg"/>
          <p className="text-muted">
            Tomas Mateo<br />
            26 años - CABA.<br />
            Técnico en Sistemas y Web developer en<br />
          </p>
          <img className="img-trabajo" src="img/logo_ml.png" />
        </div>
        <div className="col-md-6">
          <img className="img-circled" src="img/img-agus.jpeg" />
          {/* <span className="fa-stack fa-4x">
            <i className="fas fa-circle fa-stack-2x text-primary"></i>
            <i className="fas fa-laptop fa-stack-1x fa-inverse"></i>
          </span> */}
          <p className="text-muted">
            Agustin Fontova<br />
            22 años - CABA<br />
            Técnico en Sistemas y Ejecutivo de<br />
            ventas y Marketing en<br />
          </p>
          <img className="img-trabajo" src="img/logo_galicia.png" />
        </div>
      </div>
    </div>
  </section>
);

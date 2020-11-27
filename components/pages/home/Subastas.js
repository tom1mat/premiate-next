import React, { useEffect } from 'react';

import Subasta from './Subasta';

const Subastas = ({ subastas }) => {
  return (
    subastas && subastas.length > 0 ? (
      <section className="bg-light page-section container-subastas" id="subastas">
        <div className="container text-center">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2 className="section-heading text-uppercase">Subastas</h2>
              <p className="section-subheading text-muted">¿Cuántas monedas estás dispuesto a invertir para ganar eso que tanto querés? <br />Subí la apuesta y esperá el premio en casa...</p>
            </div>
          </div>
          <div className="row cards-container">
            {subastas.map((subasta) => (<Subasta key={subasta._id} subasta={subasta} />))}
          </div>
        </div>
      </section>
    ) : (
      <div>No hay subastas</div>
    )
  )
};

export default Subastas;

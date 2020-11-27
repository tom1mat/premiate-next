import React from 'react';

import Sorteo from './Sorteo';

const Sorteos = ({ usuario, sorteos }) => {
  const userSorteos = (usuario && usuario.sorteos) ? usuario.sorteos : [];

  return (
    sorteos && sorteos.length > 0 ? (
    <section className="bg-light page-section" id="sorteos">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h2 className="section-heading text-uppercase">Sorteos</h2>
            <p className="section-subheading text-muted">¿Cuántos requisitos tenés que cumplir para participar de un sorteo en redes? <br />Elegí tu premio y participá con un solo click..</p>
          </div>
        </div>
        <div className="row cards-container">
          {
            sorteos.map((sorteo, index) => <Sorteo sorteo={sorteo} key={sorteo._id} id={sorteo._id} titulo={sorteo.sorteo} isSuscribed={!!userSorteos[sorteo._id]} />)
          }
        </div>
      </div>
    </section>
     ) : (
      <div>No hay sorteos</div>
    )
  );
}

export default Sorteos;

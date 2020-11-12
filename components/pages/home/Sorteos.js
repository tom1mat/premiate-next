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
            <h3 className="section-subheading text-muted">Lorem ipsum dolor sit amet consectetur.</h3>
          </div>
        </div>
        <div className="row">
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

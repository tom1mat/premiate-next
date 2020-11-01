import React from 'react';

import Navbar from '../../commons/Navbar';
import Footer from '../../commons/Footer';
import Sidebar from './Sidebar';
import Sorteos from './Sorteos';
import Subastas from './Subastas';
import Usuarios from './Usuarios';


const PageAdmin = ({ page, sorteos, subastas, usuarios }) => {

  let content = null;

  if (page) {
    switch (page) {
      case 'sorteos':
        content = <Sorteos sorteos={sorteos} />
        break;
      case 'subastas':
        content = <Subastas subastas={subastas} />
        break;
      case 'usuarios':
        content = <Usuarios usuarios={usuarios} />
        break;
    }
  }

  return (
    <>
      <Navbar />
      <div className="panel">
        <div style={{ display: 'flex', marginTop: '40%' }}>
          <Sidebar />
          {content}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PageAdmin;

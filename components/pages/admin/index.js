import React, { useEffect } from 'react';

import Navbar from '../../commons/Navbar';
import Footer from '../../commons/Footer';
import Sidebar from './Sidebar';
import Sorteos from './Sorteos';
import Subastas from './Subastas';
import Usuarios from './Usuarios';


const PageAdmin = ({ page, sorteos, subastas, usuarios }) => {
  useEffect(() => {
    // Collapse Navbar
    const navbarCollapse = function() {
      if ($("#mainNav").offset().top > 100) {
        $("#mainNav").addClass("navbar-shrink");
      } else {
        $("#mainNav").removeClass("navbar-shrink");
      }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);
  }, []);

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

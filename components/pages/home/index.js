import React, { useContext, useEffect } from 'react';

import Navbar from '../../commons/Navbar';
import Footer from '../../commons/Footer';
import Header from './Header';
import Nosotros from './Nosotros';
import Sorteos from './Sorteos';
import Subastas from './Subastas';

import PublicidadPlayer from '../../commons/PublicidadPlayer';

import { Context } from '../../../components/context';

const PageHome = () => {
  const { subastas, sorteos, usuario, showPublicidad } = useContext(Context);

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

  useEffect(() => {
    if (showPublicidad) {
      document.getElementsByTagName('body')[0].style.position = 'fixed';
    } else {
      document.getElementsByTagName('body')[0].style.position = '';
    }
  }, [showPublicidad]);

  return (
    <>
      <Navbar />
      <Header />
      <Nosotros />
      <Subastas subastas={subastas} />
      <Sorteos sorteos={sorteos} usuario={usuario} />
      <Footer />
      <PublicidadPlayer />
    </>
  );
}

export default PageHome;

import React, { useContext, useEffect, useState } from 'react';
import getConfig from 'next/config';
import io from 'socket.io-client';

import Navbar from '../../commons/Navbar';
import Footer from '../../commons/Footer';
import Header from './Header';
import Services from './Services';
import Sorteos from './Sorteos';
import Subastas from './Subastas';

import { Context } from '../../../components/context';

const { publicRuntimeConfig: { __SOCKETIO_SERVER } } = getConfig();

const PageHome = () => {
  const { subastas: _subastas, sorteos: _sorteos, usuario } = useContext(Context);
  const [sorteos, setSorteos] = useState(_sorteos);
  const [subastas, setSubastas] = useState(_subastas);

  useEffect(() => {
    const socket = io(__SOCKETIO_SERVER);

    socket.on('connect', function () {
      console.log('AQUI _app.js!:  connect')
      socket.on('update-data', function (data) {
        if (data.subastas) {
          setSubastas(JSON.parse(data.subastas));
        }

        if (data.sorteos) {
          setSorteos(JSON.parse(data.sorteos));
        }
      });
    });

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

  return (
    <>
      <Navbar />
      <Header />
      <Subastas subastas={subastas} />
      <Sorteos sorteos={sorteos} usuario={usuario} />
      <Services />
      <Footer />
    </>
  );
}

export default PageHome;

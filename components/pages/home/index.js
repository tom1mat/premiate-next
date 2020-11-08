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
          console.log('_app.js update-data: SUBASSTAS')
          console.log(JSON.parse(data.subastas));
          setSubastas(JSON.parse(data.subastas));
          // setSubastas([...JSON.parse(data.subastas)]);
          // setSubastas([]);
        }

        if (data.sorteos) {
          console.log('_app.js update-data: SORTEOS')
          setSorteos(JSON.parse(data.sorteos));
        }
      });
    });
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

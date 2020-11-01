import React from 'react';

import Navbar from '../../commons/Navbar';
import Footer from '../../commons/Footer';
import Header from './Header';
import Services from './Services';
import Sorteos from './Sorteos';
import Subastas from './Subastas';

import { Context } from '../../../components/context';

const PageHome = () => {
  return (
    <Context.Consumer>
      {
        ({ subastas, sorteos, usuario }) => (
          <>
            <Navbar />
            <Header />
            <Subastas subastas={subastas} />
            <Sorteos sorteos={sorteos} usuario={usuario} />
            <Services />
            <Footer />
          </>
        )
      }
    </Context.Consumer>
  );
}

export default PageHome;

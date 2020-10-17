import React from 'react';

import { Provider } from 'react-redux';

import store from '../../store';

import Navbar from '../../commons/Navbar';
import Footer from '../../commons/Footer';
import Header from './Header';
import Services from './Services';
import Sorteos from './Sorteos';
import Subastas from './Subastas';

import useAuth2 from '../../hooks/useAuth2';
const PageHome = ({ user }) => {
  const loading = useAuth2(store, user);
  
  return (
    <Provider store={store}>
      <Navbar />
      <Header />
      <Subastas />
      <Sorteos />
      <Services />
      <Footer />
    </Provider>
  );
}

export default PageHome;

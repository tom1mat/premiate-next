import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import Navbar from '../../commons/Navbar';
import Footer from '../../commons/Footer';
import Sidebar from './Sidebar';
import Sorteos from './Sorteos';
import Subastas from './Subastas';
import Usuarios from './Usuarios';

import { __API_URL } from '../../../config/client';
import store from '../../store';
import useAuth2 from '../../hooks/useAuth2';

const PageAdmin = (props) => {
  const { user, sorteos, subastas, usuarios, page } = props;
  const loading = useAuth2(store, user);
  // const [sorteos, setSorteos] = useState([]);
  // const [subastas, setSubastas] = useState([]);
  // const [usuarios, setUsuarios] = useState([]);

  // const fetchSorteos = () => {
  //   fetch(`${__API_URL}sorteos`)
  //     .then(res => res.json())
  //     .then(sorteos => setSorteos(sorteos));
  // }

  // const fetchSubastas = () => {
  //   fetch(`${__API_URL}subastas`)
  //     .then(res => res.json())
  //     .then(subastas => setSubastas(subastas));
  // }

  // const fetchUsuarios = () => {
  //   fetch(`${__API_URL}usuarios`)
  //     .then(res => res.json())
  //     .then(usuarios => setUsuarios(usuarios));
  // }

  // useEffect(() => {
  //   fetchSorteos();
  //   fetchSubastas();
  //   fetchUsuarios();
  // }, []);

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
    <Provider store={store}>
      {
        loading ? (
          <>
            <Navbar />
            <h1>Loading!</h1>
            <Footer />
          </>
        ) : (
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
          )
      }
    </Provider>
  );
}

export default PageAdmin;

import React from 'react';

import { Provider } from 'react-redux';

import Navbar from '../../commons/Navbar';
import Footer from '../../commons/Footer';
import Header from '../../commons/Header';
import Form from './Form'

import store from '../../store';
import useAuth2 from '../../hooks/useAuth2';

const PageAdmin = () => {
  const loading = useAuth2(store);

  return (
    <Provider store={store}>
      <Navbar />
      {
        !loading && (
          <section className="bg-gradient page-section profile-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 text-center">
                  <h2 className="section-heading text-uppercase">Perfil</h2>
                </div>
              </div>
              <div className="row">
                <Form />
              </div>
            </div>
          </section>
        )
      }
      <Footer />
    </Provider>
  );
}

export default PageAdmin;

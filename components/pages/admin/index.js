import React from 'react';

import { Provider } from 'react-redux';

import store from '../../store';

import Navbar from '../../commons/Navbar';
import Footer from '../../commons/Footer';

import useAuth2 from '../../hooks/useAuth2';
const PageAdmin = () => {
  const loading = useAuth2(store);

  return (
    <Provider store={store}>
      <Navbar />
      <section className="bg-gradient page-section profile-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2 className="section-heading text-uppercase">Administración</h2>
            </div>
          </div>
          <div className="row">
            
          </div>
        </div>
      </section>
      <Footer />
    </Provider>
  );
}

export default PageAdmin;

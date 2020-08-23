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

// import React, { useEffect, useState } from 'react';
// import { connect } from 'react-redux';

// import { Navbar, Footer } from './MyComponents';

// import { Route } from 'react-router-dom';

// import PageSorteos from './panel/PageSorteos';
// import PageSubastas from './panel/PageSubastas';
// import PageUsuarios from './panel/PageUsuarios';

// import Sidebar from './panel/Sidebar';

// import { __API_URL } from '../config';

// const PagePanel = ({ hasLoadedUserData, match }) => {
//   const [sorteos, setSorteos] = useState([]);
//   const [subastas, setSubastas] = useState([]);
//   const [usuarios, setUsuarios] = useState([]);

//   const fetchSorteos = () => {
//     fetch(`${__API_URL}sorteos`)
//       .then(res => res.json())
//         .then(sorteos => setSorteos(sorteos));
//   }

//   const fetchSubastas = () => {
//     fetch(`${__API_URL}subastas`)
//       .then(res => res.json())
//         .then(subastas => setSubastas(subastas));
//   }

//   const fetchUsuarios = () => {
//     fetch(`${__API_URL}usuarios`)
//       .then(res => res.json())
//         .then(usuarios => setUsuarios(usuarios));
//   }

//   useEffect(() => {
//     fetchSorteos();
//     fetchSubastas();
//     fetchUsuarios();
//   }, []);

//   return (
//   hasLoadedUserData ?
//     <div className="panel">
//       <Navbar />
//       <div style={{ display: 'flex', marginTop: '40%' }}>
//         <Sidebar />
//         <div style={{ flex: 1 }}>
//           <Route path={`${match.path}/sorteos`}>
//             <PageSorteos sorteos={sorteos} reFetchSorteos={fetchSorteos} />
//           </Route>
//           <Route path={`${match.path}/subastas`}>
//             <PageSubastas subastas={subastas} usuarios={usuarios} reFetchSubastas={fetchSubastas} />
//           </Route>
//           <Route path={`${match.path}/usuarios`} component={PageUsuarios}>
//             <PageUsuarios usuarios={usuarios} reFetchUsuarios={fetchUsuarios} />
//           </Route>
//         </div>
//       </div>
//       <Footer />
//     </div>
//     :
//     <>
//       <Navbar />
//       <h1>Loading!</h1>
//       <Footer />
//     </>
// );
// }

// const mapDispatchToProps = state => ({
//   hasLoadedUserData: state.hasLoadedUserData
// });

// export default connect(mapDispatchToProps)(PagePanel);

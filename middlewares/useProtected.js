const jwt = require('jsonwebtoken');

const { __JWTKEY } = require('../config/server');
// import { __JWTKEY } from '../config/server';

const getRoute = (url) => {
  let paths = url.split('/');
  return paths[paths.length-1];
}

const useProtected = async (req, res) => {
  //TODO: no se esta validando updateSorteo y updateUser
  const protectedRoutes = ['raise', 'unSuscribeToSorteo', 'suscribeToSorteo', 'update-sockets'];
  const route = getRoute(req.url);
  if (protectedRoutes.includes(route)) {
    return new Promise((resolve) => {
      jwt.verify(req.body.jwtToken, __JWTKEY, async (err) => {
        if (err) {
          const errorMsg = 'ERROR: Could not connect to the protected route';
          console.error(errorMsg);
          return res.status(500).end(errorMsg);
        }
        return resolve();
      });
    });
  }
};

module.exports = useProtected;

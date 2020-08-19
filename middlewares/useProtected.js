import jwt from'jsonwebtoken';

import { __JWTKEY } from '../config/server';

const getRoute = (url) => {
  let paths = url.split('/');
  return paths[paths.length-1];
}

const useProtected = async (req, res) => {
  const protectedRoutes = ['raiseSubasta', 'updateSorteo', 'updateUser', 'unSuscribeToSorteo', 'suscribeToSorteo'];
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

export default useProtected;

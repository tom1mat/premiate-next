import { useEffect, useState } from 'react';
import { notification } from 'antd';

import { __API_URL, __CLIENT_ID_GOOGLE } from '../../config/client';

const useAuth2 = (store, user) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const gapiScript = document.createElement('script');
    gapiScript.id = 'gapiScript';
    gapiScript.src = 'https://apis.google.com/js/platform.js';

    window.document.body.appendChild(gapiScript);
    gapiScript.addEventListener('load', () => {
      window.gapi.load('auth2', async () => {
        window.gapi.auth2.init({
          client_id: __CLIENT_ID_GOOGLE,
        }).then(async (auth2) => {
          if (user && user.email) {
            const email = user.email;
            const response = await fetch(`${__API_URL}/usuarios/${email}`);

            if (response.status === 200) {
              const userData = await response.json();
              store.dispatch({
                type: 'SET_JWT_TOKEN',
                payload: userData.jwtToken,
              });
              store.dispatch({
                type: 'SET_USER_DATA',
                payload: userData,
              });
              store.dispatch({
                type: 'LOG_IN',
              });
            } else if (response.status === 204) {
              notification.warning({
                placement: 'bottomRight',
                message: 'El usuario no existe',
              });
            }
          }

          setLoading(false);

          store.dispatch({
            type: 'SET_HAS_LOADED_USER_DATA',
          });
          store.dispatch({
            type: 'SET_AUTH2',
            payload: auth2,
          })
        });
      });
    });
  }, []);

  return loading;
}

export default useAuth2;

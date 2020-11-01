import { useEffect, useState } from 'react';
import getConfig from 'next/config';

const { publicRuntimeConfig: { __API_URL, __CLIENT_ID_GOOGLE } } = getConfig();

const useAuth2 = () => {
  const [auth2, setAuth2] = useState(null);

  useEffect(() => {
    // const gapiScript = document.createElement('script');
    // gapiScript.id = 'gapiScript';
    // gapiScript.src = 'https://apis.google.com/js/platform.js';
    // window.document.body.appendChild(gapiScript);
    // const gapiScript = document.getElementById('gapiScript');
    // gapiScript.addEventListener('load', () => {
      window.gapi.load('auth2', async () => {
        window.gapi.auth2.init({
          client_id: __CLIENT_ID_GOOGLE,
        }).then((_auth2) => {
          setAuth2(_auth2);
        });
      });
    // });
  }, []);

  return auth2;
}

export default useAuth2;

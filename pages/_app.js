import React, { useState, useEffect } from 'react';
import getConfig from 'next/config';
import io from 'socket.io-client';

import { Context } from '../components/context';
import PageTemplate from '../components/PageTemplate';
import { parseCookies, getUserFromCookie } from '../helpers/server';
import useAuth2 from '../components/hooks/useAuth2';

import '../styles/App.scss';

const { publicRuntimeConfig: { __API_URL, __SOCKETIO_SERVER } } = getConfig();

const MyApp = ({ Component, pageProps, sorteos: _sorteos, subastas: _subastas, usuario: _usuario, publicidades: _publicidades }) => {
  const auth2 = useAuth2();
  const [sorteos, setSorteos] = useState(_sorteos);
  const [subastas, setSubastas] = useState(_subastas);
  const [usuario, setUsuario] = useState(_usuario);
  const [publicidades, setPublicidades] = useState(_publicidades);
  const [showPublicidad, setShowPublicidad] = useState(false);

  useEffect(() => {
    const socket = io(__SOCKETIO_SERVER);

    socket.on('connect', function () {
      socket.on('update-data', function (data) {
        if (data.subastas) {
          setSubastas(JSON.parse(data.subastas));
        }

        if (data.sorteos) {
          setSorteos(JSON.parse(data.sorteos));
        }

        if (data.usuario) {
          const usuarioUpdated = JSON.parse(data.usuario);

          if (usuarioUpdated._id === _usuario._id) {
            setUsuario(usuarioUpdated);
          }
        }

        if (data.publicidades && data.usuarioId) {
          if (data.usuarioId === _usuario._id) {
            console.log('SET PUBLICIDADES!', data.publicidades)
            setPublicidades(JSON.parse(data.publicidades));
          }
        }
      });
    });
  }, []);

  return (
    <PageTemplate>
      <Context.Provider value={{ usuario, sorteos, subastas, auth2, showPublicidad, setShowPublicidad, publicidades }}>
        <Component {...pageProps} />
      </Context.Provider>
    </PageTemplate>
  );
};

function isAllowed(user, pathname) {
  if (pathname.includes('admin')) return user && user.isAdmin;
  if (pathname.includes('perfil')) return !!user;
  return true;
}

MyApp.getInitialProps = async ({ ctx: req }) => {
  const cookies = parseCookies(req.req);
  const user = cookies ? await getUserFromCookie(cookies) : false;

  if (!isAllowed(user, req.pathname)) {
    req.res.writeHead(302, { Location: '/' });
    return req.res.end();
  }

  const [sorteos, subastas, publicidades, usuario] = await getInitialData(user ? user.email : null);

  return {
    sorteos, subastas, publicidades, usuario
  }
};

export default MyApp;

const getInitialData = async (email) => {
  const sorteosPromise = fetch(`${__API_URL}/sorteos`);
  const subastasPromise = fetch(`${__API_URL}/subastas`);
  const publicidadesPromise = fetch(`${__API_URL}/publicidades?email=${email}`);
  const promises = [sorteosPromise, subastasPromise, publicidadesPromise];

  if (email) {
    const usuarioPromise = new Promise(async (resolve) => {
      const response = await fetch(`${__API_URL}/usuarios/${email}`);
      if (response.status === 200) {
        resolve(response.json());
      }

      resolve(null);
    });
    promises.push(usuarioPromise);
  } else {
    promises.push(Promise.resolve(null));
  }

  return Promise.all(
    promises
  ).then(async ([sorteosResponse, subastasResponse, publicidadesResponse, usuarioResponse]) => {
    return [
      await sorteosResponse.json(),
      await subastasResponse.json(),
      await publicidadesResponse.json(),
      usuarioResponse ?
        await usuarioResponse.json ? usuarioResponse.json() : usuarioResponse
        :
        null,
    ]
  });
}

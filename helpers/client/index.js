import store from '../../components/store';
import getConfig from 'next/config';
import { useContext } from 'react';
import { Context } from '../../components/context';

const { publicRuntimeConfig: { __API_URL } } = getConfig();

const setLocalItem =(key, data) => {
  try {
    localStorage.setItem(key, data);
  } catch (error) {
    return false;
  }
}

const getLocalItem = key => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

const removeLocalItem = key => {
  localStorage.removeItem(key);
}

const useFetchData = () => {
  const { usuario } = useContext(Context)

  const fetchData = async (url, data, method, contentType) => {
    let body;
    if (contentType === 'formData') {
      data.append('jwtToken', usuario.jwtToken);
      body = data;
    } else {
      body = JSON.stringify({
        jwtToken: usuario.jwtToken,
        ...data
      });
    }

    const config = {
      method,
      body,
      headers: {
        'Content-Type': 'application/json' //'multipart/form-data'
      }
    }

    if (contentType === 'formData') delete config.headers;

    try {
      const res = await fetch(`${__API_URL}/${url}`, config);
      if (res.status === 200) {
        return await res.json();
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  return fetchData;
};

const isPasswordStrong = (password) => {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  return re.test(String(password));
}

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export {
  setLocalItem,
  getLocalItem,
  removeLocalItem,
  useFetchData,
  isPasswordStrong,
  validateEmail,
};

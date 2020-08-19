import store from '../../components/store';
import { __API_URL } from '../../config/client';

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

const fetchData = async (url, data, method, contentType) => {
  const jwtToken = store.getState().jwtToken;
  let body;
  if (contentType === 'formData') {
    data.append('jwtToken', jwtToken);
    body = data;
  } else {
    body = JSON.stringify({
      jwtToken,
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
};

export {
  setLocalItem,
  getLocalItem,
  removeLocalItem,
  fetchData,
};

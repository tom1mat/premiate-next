import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import getConfig from 'next/config';
import fs from 'fs';
import { serialize } from 'cookie';

const { publicRuntimeConfig: { __JWTKEY, __IMAGENES_UPLOAD_PATH, __SALTROUNDS, __SOCKETIO_API } } = getConfig();

const getJwtToken = async (data) => {
  return await new Promise((resolve, reject) => {
    jwt.sign(data, __JWTKEY, {}, async (err, jwtToken) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(jwtToken);
      }
    });
  });
}

const { getModelFromString, getModel, createModel, updateModel, deleteModel } = require('./dbmodels');

const generateHash = (password, bcrypt) => (new Promise(
  resolve => {
    bcrypt.genSalt(__SALTROUNDS, function (err, salt) {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return resolve(false);
        return resolve(hash);
      });
    });
  })
);

export const getUserFromCookie = (cookies) => {
  const { jwtToken } = cookies;
  return new Promise((resolve) => {
    if (!jwtToken) return resolve(null);

    jwt.verify(jwtToken, __JWTKEY, (err, data) => {
      resolve((err || !data) ? null : data)
    });
  });
}

export const parseCookies = (req, document) => {
  return cookie.parse(req ? req.headers.cookie || '' : typeof document === 'undefined' ? '' : document.cookie);
}

const deleteFile = (file) => new Promise(res => {
  try {
    fs.unlink(file, (err) => {
      if (err) {
        console.error(err);
        return res(false);
      }
      return res(true);
    });
  } catch (error) {
    console.error(error);
    return res(false);
  }
});

const deleteImage = (image) => deleteFile(`${__IMAGENES_UPLOAD_PATH}${image}`);

const setCookie = (res, name, value) => {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

  // if ('maxAge' in options) {
  //   options.expires = new Date(Date.now() + options.maxAge)
  //   options.maxAge /= 1000
  // }

  const options = {
    expires: new Date(Date.now() + options.maxAge),
    maxAge: 1000
  }

  res.setHeader('Set-Cookie', serialize(name, String(stringValue)))
};

const isAdmin = email => ['tomasmateo10@gmail.com', 'agus.fontova@gmail.com', 'admin@premiate.ar'].includes(email);

const updateUserSockets = (data) => {
  const params = {
    method: 'POST',
    body: JSON.stringify({
      usuario: data,
    }),
    headers: { 'Content-Type': 'application/json' },
  };

  fetch(`${__SOCKETIO_API}/update-data`, params);
}

module.exports = {
  dbModels: {
    getModelFromString,
    getModel,
    updateModel,
    createModel,
    deleteModel,
  },
  getJwtToken,
  generateHash,
  parseCookies,
  getUserFromCookie,
  deleteFile,
  deleteImage,
  setCookie,
  isAdmin,
  updateUserSockets,
};

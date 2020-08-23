import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import { __JWTKEY } from '../../config/server';

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

const generateHash = password => (new Promise(
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
    jwt.verify(jwtToken, __JWTKEY, (err, data) => resolve((err || !data) ? null : data));
  });
}

export const parseCookies = (req, document) => {
  return cookie.parse(req ? req.headers.cookie || '' : typeof document === 'undefined' ? '' : document.cookie);
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
  getUserFromCookie
}

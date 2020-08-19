import jwt from 'jsonwebtoken';
import { __JWTKEY } from '../../config/server';

const getJwtToken = async (email) => {
  return await new Promise((resolve, reject) => {
    jwt.sign({ email }, __JWTKEY, {}, async (err, jwtToken) => {
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

module.exports = {
  dbModels: {
    getModelFromString,
    getModel,
    updateModel,
    createModel,
    deleteModel,
  },
  getJwtToken,
  generateHash
}

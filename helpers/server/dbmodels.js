/* eslint-disable array-callback-return */
import sorteoModel from '../../models/sorteo';
import subastaModel from '../../models/subasta';
import userModel from '../../models/users';
import publicidadModel from '../../models/publicidad';

const getModelFromString = (model) => {
  switch (model) {
    case 'sorteos':
      return sorteoModel;
    case 'subastas':
      return subastaModel;
    case 'users':
      return userModel;
    case 'publicidades':
      return publicidadModel;
    default:
      return null;
  }
}

const getModel = (modelString, data) => {
  return new Promise(async (resolve, reject) => {
    const model = getModelFromString(modelString);
    try {
      if (data) {
        await model.findOne(data, (error, retObject) => {
          if (error) {
            return reject(error);
          }
          return resolve(retObject);
        }).lean();
      } else {
        await model.find((error, retObjects) => {
          if (error) {
            return reject(error);
          }
          return resolve(retObjects);
        });
      }
    } catch (error) {
      reject(error);
    }
  });
}

const createModel = async (modelString, data) => {
  return new Promise(async (resolve, reject)=>{
    const model = getModelFromString(modelString);
    const object = new model(data);

    try {
      await object.save();
      return resolve(object);
    } catch (error) {
      console.error(error);
      return reject();
    }
  });
}

const updateModel = async (modelString, query, data) => {
  try {
    const model = getModelFromString(modelString);
    const updated = await model.update(query, data);

    if (updated.ok === 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

const deleteModel = async (modelString, query) => {
  try {
    const model = getModelFromString(modelString);
    await new Promise((resolve, reject) => {
      model.deleteOne(query, err => {
        if (err) return reject(err);

        return resolve();
      });
    })

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = {
  getModelFromString,
  getModel,
  createModel,
  updateModel,
  deleteModel,
}

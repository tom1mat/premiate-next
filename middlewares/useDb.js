import mongoose from 'mongoose';
import getConfig from 'next/config';

const { publicRuntimeConfig: { __MONGO_CONNECTION } } = getConfig();

const useDb = async (req) => {
  if (mongoose.connections[0].readyState) return;

  return new Promise((resolve) => {
    mongoose.connect(__MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;

    db.on('error', (error) => {
      throw new Error(error)
    });// console.error.bind(console, 'connection error:')
    db.once('open', () => {
      console.log('CONNECTED MONGO!')
      req.mongoose = db;
      resolve();
    });
  });
}

export default useDb;

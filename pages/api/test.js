import getConfig from 'next/config';
import bcrypt from 'bcrypt';
)
const {
  generateHash
} = require('../../helpers/server';

const { publicRuntimeConfig: { __SOCKETIO_SERVER } } = getConfig();

export default async (req, res) => {

  try {
    const pass = await generateHash('sarasa', bcrypt);
    res.status(200).send({ pass });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}

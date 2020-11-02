const withSass = require('@zeit/next-sass')

const { MONGO_USER, MONGO_PASS, DEVELOP, __JWTKEY, __CLIENT_ID_GOOGLE } = process.env;
const __MONGO_CONNECTION = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@premiate-cyijj.mongodb.net/premiate?retryWrites=true&w=majority`;

module.exports = withSass({
  publicRuntimeConfig: {
    __API_URL: DEVELOP ? 'http://localhost:3001/api' : 'https://premiate.ar/api',
    DEVELOP,
    __SOCKETIO_SERVER: DEVELOP ? 'http://localhost:3030' : 'https://premiate.ar/socketio',
    __CLIENT_ID_GOOGLE,
    __PORT: process.env.PORT | 80,
    __JWTKEY,
    __STARTINGCREDITS: 500,
    __SALTROUNDS: 10,
    __MONGO_CONNECTION,
    __IMAGENES_UPLOAD_PATH: DEVELOP ? 'nginxfiles/imagenes/' : '/home/files-premiate/',
    __IMAGENES_PUBLIC_PATH: 'imagenes/'
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    return config;
  }
});

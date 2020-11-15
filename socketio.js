const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// const useProtected = require('./middlewares/useProtected');

io.on('connection', function (socket) {
  socket.on('message', function (data) {

  });
});

const port = 3030;
server.listen(port, () => console.log(`Server listening on ${port}`));

app.use(require('body-parser').json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  );
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Allow', 'POST');
  res.header('Content-Type', 'application/json');
  next();
});

app.post('/update-sockets', (req, res) => {
  const { id, amount, email, name } = req.body;

  io.sockets.emit(`raise-${id}`, amount, email, name);
  res.status(200);
});

app.post('/update-data', (req, res) => {
    const { subastas, sorteos, usuario, publicidades, usuarioId } = req.body;

    const data = { };

    if (subastas) {
      data.subastas = JSON.stringify(subastas);
      console.log('update subastas!')
    }

    if (sorteos) {
      data.sorteos = JSON.stringify(sorteos);
      console.log('update sorteos!')
    }

    if (usuario) {
      data.usuario = JSON.stringify(usuario);
      console.log('update usuario!' + usuario._id)
    }

    if (publicidades) {
      data.publicidades = JSON.stringify(publicidades);
      data.usuarioId = usuarioId;
      console.log('update publicidades!')
    }

    io.sockets.emit('update-data', data);
    res.status(200);
});

app.get('/ping', (req, res) => {
  res.status(200).json('pong');
});

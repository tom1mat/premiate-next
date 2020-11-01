const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// const useProtected = require('./middlewares/useProtected');

io.on('connection', function (socket) {
  socket.on('message', function (data) {
    console.log(data);
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
  // useProtected(req, res).then(() => {
    const { id, amount, email, name } = req.body;

    io.sockets.emit(`raise-${id}`, amount, email, name);
    res.status(200);
  // });
});

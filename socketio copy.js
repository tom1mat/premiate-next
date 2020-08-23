const Server = require('socket.io');
const http = require('http');

const CLIENT_PORT = 3030;
const SERVER_PORT = 3031;

const io = Server(CLIENT_PORT);
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    console.log(req.body);
    // const { id, amount, email, name } = req.body;
    // io.sockets.emit(`raise-${id}`, amount, email, name);
    res.statusCode = 200;
    res.end();
  } else {
    res.statusCode = 400;
    res.end();
  }
})

server.listen(SERVER_PORT, () => {
  console.log(`Server running at ${SERVER_PORT}`)
})

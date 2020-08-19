import Server from 'socket.io';

const useSocketIo = (req, res) => {
  if (!req.io) {
    const io = new Server(res.socket.server);

    io.on('connection', function (socket) {
      socket.on('message', function (data) {
        console.log(data);
      });
    });

    req.io = io;
  }
}

export default useSocketIo;

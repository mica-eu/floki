module.exports = (server) => {
  const io = require('socket.io')(server);

  io.on('connect', socket => {
    console.log(`[socket] ${socket.id} connected`);

    socket.on('join', ({ room }) => {
      const r = io.sockets.adapter.rooms[room];

      if (r && r.length >= 2) {
        return console.log(`[socket] room ${room} is full`);
      }

      socket.join(room);
      socket.to(room).emit('joined', { id: socket.id });
    });

    socket.on('disconnect', () => {
      io.emit('leave', { id: socket.id });
      console.log(`[socket] ${socket.id} disconnect`);
    });

    socket.on('offer', details => {
      socket.broadcast.emit('offer', details);
      console.log(`[socket] ${details.from} offer to ${details.to}`);
    });

    socket.on('answer', details => {
      socket.broadcast.emit('answer', details);
      console.log(`[socket] ${details.from} answer to ${details.to}`);
    });

    socket.on('candidate', details => {
      socket.broadcast.emit('candidate', details);
      console.log(`[socket] ${details.from} candidate to ${details.to}`);
    });
  });
};

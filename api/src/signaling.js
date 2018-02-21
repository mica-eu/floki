module.exports = (server) => {
  const io = require('socket.io')(server);

  io.on('connect', socket => {
    console.log(`[socket] ${socket.id} connected`);

    socket.on('join', ({ room }) => {
      const r = io.sockets.adapter.rooms[room];

      if (r && r.length >= 4) {
        return console.log(`[socket] room ${room} is full`);
      }

      socket.join(room);
      socket.to(room).emit('joined', JSON.stringify({ id: socket.id }));
    });

    socket.on('disconnect', () => {
      io.emit('leave', JSON.stringify({ id: socket.id }));
      console.log(`[socket] ${socket.id} disconnect`);
    });

    socket.on('offer', details => {
      socket.broadcast.emit('offer', details);
      console.log('[socket] offer:', JSON.stringify(details));
    });

    socket.on('answer', details => {
      socket.broadcast.emit('answer', details);
      console.log('[socket] answer:', JSON.stringify(details));
    });

    socket.on('candidate', details => {
      socket.broadcast.emit('candidate', details);
      console.log('[socket] candidate:', JSON.stringify(details));
    });
  });
};

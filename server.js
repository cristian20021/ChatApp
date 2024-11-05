const io = require('socket.io')(3000);
const users = {};

io.on('connection', socket => {
  console.log(`User connected with ID: ${socket.id}`);

  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  });

  socket.on('send-chat-message', message => {
    const userName = users[socket.id];
    socket.broadcast.emit('chat-message', { message: message, name: userName, id: socket.id });
  });

  socket.on('disconnect', () => {
    const userName = users[socket.id];
    if (userName) {
      socket.broadcast.emit('user-disconnected', userName);
      delete users[socket.id];
    }
    console.log(`User disconnected with ID: ${socket.id}`);
  });

  socket.on('question-answered', answer => {
    console.log('The answer from the first user:', answer);
    io.emit("hidden-message", answer);  // Broadcast answer to all users
  });
});

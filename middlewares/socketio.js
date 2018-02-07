const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const { sendMessage } = require('../controllers/messages');

function socketAuth(socket, next) {
  const { token } = socket.handshake.query;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error('Failed to authenticate socket'));
      }
      socket.decoded = decoded;
      return next();
    });
  }
  return next(new Error('Failed to authenticate socket'));
}

function socketio(io) {
  io.use(socketAuth)

  io.on('connection', socket => {
    socket.on('mount-chat', (chatId) => {
      socket.join(chatId);
    });

    socket.on('unmount-chat', (chatId) => {
      socket.leave(chatId);
    })

    socket.on('send-message', (message) => {
      const { chatId, content } = message;

      return sendMessage(socket.decoded.userId, chatId, { content })
        .then(({ success, message }) => {
          // TODO: Implement sending .to specific chat
          // user socket.broadcast, and update list of messages on client
          io.to(chatId).emit('new-message', {
            success,
            message
          });
        })
        .catch(error => {
          // Handle errors
          console.log(error);
        });
    });
  });

  return (req, res, next) => {
    res.io = io;
    next();
  };
}

module.exports = socketio;

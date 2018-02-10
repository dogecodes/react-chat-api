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
      // eslint-disable-next-line
      socket.decoded = decoded;
      return next();
    });
  }
  return next(new Error('Failed to authenticate socket'));
}

function socketio(io) {
  io.use(socketAuth);

  io.on('connection', (socket) => {
    socket.on('mount-chat', (chatId) => {
      socket.join(chatId);
    });

    socket.on('unmount-chat', (chatId) => {
      socket.leave(chatId);
    });

    socket.on('send-message', (newMessage) => {
      const { chatId, content } = newMessage;

      return sendMessage(socket.decoded.userId, chatId, { content })
        .then(({ success, message }) => {
          io.to(chatId).emit('new-message', {
            success,
            message,
          });
        })
        .catch((error) => {
          // Handle errors
          // eslint-disable-next-line
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

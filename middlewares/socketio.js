
function socketio(io) {
  return (req, res, next) => {
    res.io = io;
    next();
  };
}

module.exports = socketio;

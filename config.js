module.exports = {
  PORT: process.env.MT_PORT || 8000,
  JWT_SECRET: process.env.JWT_SECRET || 'dogecodes-secret',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/dogecodes-chat-app',
};

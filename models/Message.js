const mongoose = require('mongoose');

const ignoreEmpty = (val) => (val !== '' ? val : undefined);

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      set: ignoreEmpty,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
    content: String,
    statusMessage: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);

const ObjectId = require('mongoose').Types.ObjectId;
const Message = require('../models/Message');

function sendMessage(userId, chatId, data) {
  const message = new Message(Object.assign({}, data, {
    sender: ObjectId(userId),
    chatId: ObjectId(chatId),
    statusMessageUserId: ObjectId(userId),
  }));

  return message.save()
    .then((savedMessage) => {
      return Message.findOne({ _id: ObjectId(savedMessage._id) })
        .populate({ path: 'sender', select: 'username firstName lastName' })
        .exec();
    })
    .then((message) => Promise.resolve({
      success: true,
      message,
    }));
}

function getAllMessages(chatId) {
  return Message.find({ chatId: ObjectId(chatId) })
    .populate({ path: 'sender', select:'username firstName lastName' })
    .sort({ createdAt: 1 })
    .exec()
    .then((messages) => Promise.resolve({
      success: true,
      messages,
    }));
}

module.exports = {
  sendMessage,
  getAllMessages,
};

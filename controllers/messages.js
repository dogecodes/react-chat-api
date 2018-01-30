const Message = require('../models/Message');

function sendMessage(userId, chatId, data) {
  const message = new Message(Object.assign({}, data, {
    sender: userId,
    chatId: chatId,
    statusMessageUserId: userId,
  }));

  return message.save()
    .then((savedMessage) => {
      const populateQuery = data.statusMessage
        ? { path: 'statusMessageUserId', select:'username profile' }
        : { path: 'sender', select: 'username profile' };

      return Message.findOne({ _id: savedMessage._id })
        .populate(populateQuery)
        .populate({ path: 'chatId', select: 'creator members' })
        .exec();
    })
    .then((message) => Promise.resolve({
      success: true,
      message,
    }));
}

function getAllMessages(chatId) {
  return Message.find({ chatId })
    .populate({ path: 'statusMessageUserId', select:'username profile' })
    .populate({ path: 'sender', select:'username profile' })
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

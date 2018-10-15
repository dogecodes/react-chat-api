const Message = require('../models/Message');

function sendMessage(userId, chatId, data) {
  const message = new Message(
    Object.assign({}, data, {
      chatId,
      sender: userId,
      statusMessageUserId: userId,
    })
  );

  return message
    .save()
    .then((savedMessage) =>
      Message.findById(savedMessage._id)
        .populate({ path: 'sender', select: 'username firstName lastName' })
        .exec()
    )
    .then((savedMessage) =>
      Promise.resolve({
        success: true,
        message: savedMessage,
      })
    );
}

function getAllMessages(chatId) {
  return Message.find({ chatId })
    .populate({ path: 'sender', select: 'username firstName lastName' })
    .sort({ createdAt: 1 })
    .exec()
    .then((messages) =>
      Promise.resolve({
        success: true,
        messages,
      })
    );
}

module.exports = {
  sendMessage,
  getAllMessages,
};

const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

const messagesController = require('./messages');

function getAllChats() {
  return Chat.find()
    .populate({ path: 'creator', select: 'username firstName lastName' })
    .populate({ path: 'members', select: 'username firstName lastName' })
    .lean()
    .exec()
    .then((chats) => Promise.resolve({
      success: true,
      chats
    }))
}

function getMyChats(userId) {
  return Chat.find({
    $or: [
      { creator: userId },
      { members: userId }
    ]
  })
    .populate({ path: 'creator', select: 'username firstName lastName' })
    .populate({ path: 'members', select: 'username firstName lastName' })
    .lean()
    .exec()
    .then((chats) => Promise.resolve({
      success: true,
      chats,
    }));
}

function joinChat(userId, chatId) {
  return Chat.findOne({ _id: chatId })
    .populate({ path: 'creator', select: 'username firstName lastName' })
    .populate({ path: 'members', select: 'username firstName lastName' })
    .lean()
    .exec()
    .then((chat) => {
      if (!chat) {
        return Promise.reject({
          success: false,
          message: 'Chat not found',
        });
      }

      const isCreator = chat.creator._id.toString() === userId;
      const isMember = chat.members.some(member => member._id.toString() === userId);

      if (isCreator || isMember) {
        return Promise.reject({
          success: false,
          message: 'User has already joined this chat',
        });
      }

      return Chat.findOneAndUpdate({
        _id: chatId
      }, {
        $push: { members: userId }
      }, {
        new: true
      })
        .populate({ path: 'creator', select: 'username firstName lastName' })
        .populate({ path: 'members', select: 'username firstName lastName' })
        .lean()
        .exec();
    })
    .then((chat) => {
      const statusMessage = messagesController.sendMessage(userId, chatId, {
        content: ' joined',
        statusMessage: true,
      });

      return Promise.all([chat, statusMessage]);
    })
    .then(([chat, statusMessage]) => {
      return Promise.resolve({
        success: statusMessage.success,
        message: statusMessage.message,
        chat,
      })
    });
}

function leaveChat(userId, chatId) {
  return Chat.findOne({ _id: chatId })
    .populate({ path: 'creator', select: 'username firstName lastName' })
    .populate({ path: 'members', select: 'username firstName lastName' })
    .lean()
    .exec()
    .then((chat) => {
      if (!chat) {
        return Promise.reject({
          success: false,
          message: 'Chat not found',
        });
      }

      const isCreator = chat.creator._id.toString() === userId;
      const isMember = chat.members.some(member => member._id.toString() === userId);

      if (isCreator) {
        return Promise.reject({
          success: false,
          message: 'You cannot delete your own chat! You can only delete you own chats.'
        })
      }

      if (!isMember) {
        return Promise.reject({
          success: false,
          message: 'User is not a member of this chat',
        });
      }

      return Chat.findOneAndUpdate({
        _id: chatId
      }, {
        $pull: { members: userId }
      }, {
        new: true
      })
        .populate({ path: 'creator', select: 'username firstName lastName' })
        .populate({ path: 'members', select: 'username firstName lastName' })
        .lean()
        .exec();
    })
    .then((chat) => {
      const statusMessage = messagesController.sendMessage(userId, chatId, {
        content: ' left',
        statusMessage: true,
      });

      return Promise.all([chat, statusMessage]);
    })
    .then(([chat, statusMessage]) => {
      return Promise.resolve({
        success: statusMessage.success,
        message: statusMessage.message,
        chat,
      })
    });
}

function getChat(userId, chatId) {
  return Chat.findOne({ _id: chatId })
    .populate({ path: 'creator', select:'username firstName lastName' })
    .populate({ path: 'members', select:'username firstName lastName' })
    .lean()
    .exec()
    .then((chat) => {
      if (!chat) {
        return Promise.reject({
          success: false,
          message: 'Chat not found',
        })
      }

      return Promise.resolve({
        success: true,
        chat,
      });
    });
}

function newChat(userId, data) {
  const chat = new Chat({
    creator: userId,
    title: data.title,
    description: data.description,
    members: data.members,
  });

  return chat.save()
    .then((newChat) => {
      return Chat.findOne({ _id: newChat._id })
        .populate({path: 'creator', select:'username firstName lastName'})
        .populate({path: 'members', select:'username firstName lastName'})
        .lean()
        .exec()
    })
    .then((newChat) => {
      return Promise.resolve({
        success: true,
        message: 'Chat has been created',
        chat: newChat,
      });
    })
}

function deleteChat(userId, chatId) {
  return Chat.findOne({
    creator: userId,
    _id: chatId,
  })
    .exec()
    .then((chat) => {
      if (!chat) {
        return Promise.reject({
          success: false,
          message: 'Chat not found. Perhaps it`s already deleted.',
        });
      }

      return Chat.remove({ _id: chatId }).exec();
    })
    .then(deletedChat => Promise.resolve({
      success: true,
      message: 'Chat deleted!'
    }));
}

module.exports = {
  getAllChats,
  getMyChats,
  getChat,
  joinChat,
  leaveChat,
  newChat,
  deleteChat,
};

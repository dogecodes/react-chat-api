const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

const messagesController = require('./messages');

function getAllChats() {
  return Chat.find()
    .populate({ path: 'creator', select: 'username profile' })
    .populate({ path: 'members', select: 'username profile' })
    .lean()
    .exec()
    .then((chats) => Promise.resolve({
      success: true,
      chats
    }))
}

function joinChat(userId, chatId) {
  return Chat.findOneAndUpdate(
    { _id: chatId },
    { $push: { members: userId } },
    { new: true }
  )
    .populate({path: 'creator', select:'username profile'})
    .populate({path: 'members', select:'username profile'})
    .lean()
    .exec()
    .then((chat) => {
      const statusMessage = messagesController.sendMessage(userId, chatId, {
        content: ' joined',
        statusMessage: true,
      });

      return Promise.all([chat, statusMessage]);
    })
    .then(([chat, statusMessage]) => Promise.resolve({
      success: !!statusMessage.success,
      newMemberAdded: !!statusMessage.success,
      chat,
    }));
}

function getChat(userId, chatId) {
  return Chat.findOne({ _id: chatId })
    .populate({ path: 'creator', select:'username profile' })
    .populate({ path: 'members', select:'username profile' })
    .lean()
    .exec()
    .then((chat) => {
      if (!chat) {
        return Promise.reject({
          success: false,
          message: 'Chat not found',
        })
      }

      const isCreator = chat.creator._id.toString() === userId;
      const isMember = chat.members.some(member => member._id.toString() === userId);

      if (!isCreator && !isMember) {
        return joinChat(userId, chatId);
      }

      return Promise.resolve({
        success: true,
        newMemberAdded: false,
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
        .populate({path: 'creator', select:'username profile'})
        .populate({path: 'members', select:'username profile'})
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
      console.log(chat);
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
      message: 'Chat deleted!',
      chat: deleteChat,
    }));
}

module.exports = {
  getAllChats,
  getChat,
  joinChat,
  newChat,
  deleteChat,
};

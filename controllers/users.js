const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Get list of all users
function getAllUsers(exceptId) {
  return User.find({ _id: { $ne: exceptId } })
    .select('username firstName lastName')
    .exec()
    .then((users) =>
      Promise.resolve({
        success: true,
        message: 'Users has been found',
        users,
      })
    );
}

// Get profile data for specific user by id
function getUserData(userId) {
  return User.findById(userId)
    .select('username firstName lastName createdAt')
    .lean()
    .exec();
}

// Get chats where user is a member
function getUserChats(userId) {
  return Chat.find({ creator: userId })
    .limit(5)
    .populate({ path: 'creator', select: 'username firstName lastName' })
    .sort({ createdAt: -1 })
    .lean()
    .exec()
    .then((chats) => chats || []);
}

// Count the amount of messages by specific user
function countUserMessages(userId) {
  return Message.find({ sender: userId, statusMessage: false })
    .count()
    .exec()
    .then((count) => count || 0);
}

// Get User data by specific id
function getUserById(userId) {
  const userPromises = [
    getUserData(userId),
    getUserChats(userId),
    countUserMessages(userId),
  ];

  return Promise.all(userPromises).then(([user, chats, messagesCount]) => {
    if (!user) {
      return Promise.reject({
        success: false,
        message: 'There is no users with this ID',
      });
    }

    return Promise.resolve({
      success: true,
      message: 'User information has been retrieved',
      user: Object.assign({}, user, { chats, messagesCount }),
    });
  });
}

function editUser(userId, data) {
  if (!data.username) {
    return Promise.reject({
      success: false,
      message: 'Username is not provided!',
    });
  }

  return User.findOne({
    _id: { $ne: userId },
    username: data.username,
  })
    .then((user) => {
      if (user) {
        return Promise.reject({
          success: false,
          message: 'This username is already taken. Please try another',
        });
      }

      return user;
    })
    .then(() =>
      User.findByIdAndUpdate(
        userId,
        {
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
        },
        {
          new: true,
        }
      ).select('username firstName lastName')
    )
    .then((user) => {
      if (!user) {
        return Promise.reject({
          success: false,
          message: 'User not found!',
          notExists: true,
        });
      }

      return Promise.resolve({
        success: true,
        message: 'User has been updated!',
        user,
      });
    });
}

module.exports = {
  getAllUsers,
  getUserById,
  editUser,
};

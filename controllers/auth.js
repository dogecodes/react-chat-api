const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config');
const userController = require('./users');

// Sign up new user by username and password
function signUp(username, password) {
  if (!username || !password) {
    return Promise.reject({
      success: false,
      message: 'Please, provide username and password!',
    });
  }

  return User.findOne({ username })
    .exec()
    .then((user) => {
      if (user) {
        return Promise.reject({
          success: false,
          message: 'Username is already taken',
        });
      }

      const newUser = new User({
        username,
        password,
      });

      return newUser.save();
    })
    .then((savedUser) => userController.getUserById(savedUser._id))
    .then(({ user }) => {
      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: 60 * 60 * 24 * 10 } // 10 days
      );

      return Promise.resolve({
        success: true,
        message: 'User has been created',
        token,
        user,
      });
    });
}

// Login user by username and password
function login(username, password) {
  if (!username || !password) {
    return Promise.reject({
      success: false,
      message: 'Please, provide username and password!',
    });
  }

  return User.findOne({ username })
    .exec()
    .then((user) => {
      if (!user) {
        return Promise.reject({
          message: 'Sorry, no account found with the username',
          notExists: true,
        });
      }

      return Promise.all([
        Promise.resolve(user),
        user.comparePassword(password),
      ]);
    })
    .then(([user, isPasswordMatch]) => {
      if (!isPasswordMatch) {
        return Promise.reject({
          success: false,
          message: 'The username or password you entered is incorrect.',
        });
      }
      return user;
    })
    .then((savedUser) => userController.getUserById(savedUser._id))
    .then(({ user }) => {
      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: 60 * 60 * 24 * 10 } // 10 days
      );

      return Promise.resolve({
        success: true,
        message: 'Success! You are logged in.',
        token,
        user,
      });
    });
}

// Logout username
// You should remove JWT from localStorage
function logout() {
  return Promise.resolve({
    success: true,
    message: 'You are now logged out',
  });
}

module.exports = {
  signUp,
  login,
  logout,
};

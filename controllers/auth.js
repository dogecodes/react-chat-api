const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../config');

// Sign up new user by username and password
function signUp(username, password) {
  if (!username || !password) {
    return Promise.reject({
      success: false,
      message: 'Please, provide username and password!'
    });
  }

  return User.findOne({ username: username.toLowerCase() })
    .exec()
    .then((user) => {
      if (user) {
        return Promise.reject({
          success: false,
          message: 'Username is already taken',
        });
      }

      const newUser = new User({
        username: username,
        password: password,
      });

      return newUser.save();
    })
    .then((savedUser) => {
      const token = jwt.sign(
        { userId: savedUser._id },
        secret,
        { expiresIn: 86400 }
      );

      return Promise.resolve({
        success: true,
        message: 'User has been created',
        token,
        user: {
          username: savedUser.username,
          profile: savedUser.profile,
        }
      });
    });
}

// Login user by username and password
function login(username, password) {
  if (!username || !password) {
    return Promise.reject({
      success: false,
      message: 'Please, provide username and password!'
    });
  }

  return User.findOne({ username: username.toLowerCase() }).exec()
    .then((user) => {
      if (!user) {
        return Promise.reject({
          message: 'Sorry, no account found with the username',
          notExists: true
        })
      }

      return Promise.all([
        Promise.resolve(user),
        user.comparePassword(password)
      ]);
    })
    .then(([user, isPasswordMatch]) => {
      if (!isPasswordMatch) {
        return Promise.reject({
          success: false,
          message: 'The username or password you entered is incorrect.',
        });
      }

      const token = jwt.sign(
        { userId: user._id },
        secret,
        { expiresIn: 86400 }
      );
      
      return Promise.resolve({
        success: true,
        message: 'Success! You are logged in.',
        token,
        user: {
          _id: user._id,
          username: user.email,
          password: user.password,
          profile: user.profile
        }
      });
    });
}

// Logout username
// You should remove JWT from localStorage
function logout() {
  return Promise.resolve({
    success: true,
    message: 'You are now logged out'
  });
}

module.exports = {
  signUp,
  login,
  logout,
};

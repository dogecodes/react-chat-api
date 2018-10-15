const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    password: String,
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    lastVisit: Date,
  },
  { timestamps: true }
);

// Password hash middleware.
userSchema.pre('save', function checkPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  return bcrypt.genSalt(10, (saltErr, salt) => {
    if (saltErr) {
      return next(saltErr);
    }

    return bcrypt.hash(this.password, salt, (hashErr, hash) => {
      if (hashErr) {
        return next(hashErr);
      }

      this.password = hash;
      return next();
    });
  });
});

// Helper method for validating user's password.
userSchema.methods.comparePassword = function comparePassword(
  candidatePassword
) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      return resolve(isMatch);
    });
  });
};

module.exports = mongoose.model('User', userSchema);

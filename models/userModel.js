const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

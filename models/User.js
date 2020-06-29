const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  accountName: String,
  email: String,
  password: String
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
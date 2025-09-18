
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: false, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }, // hashed
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
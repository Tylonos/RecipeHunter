const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // New field
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' }, // For the Base64 string
  age: { type: String, default: '' },
  occupation: { type: String, default: '' },
  cookingExp: { type: String, default: '' },
  allergies: { type: [String], default: [] },
  appliances: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
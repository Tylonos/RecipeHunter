
const mongoose = require('mongoose');

//This is the blueprint for what a "User" looks like in our database.
// If it's required: true, the database will throw an error if we try to save a user without it.
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, 
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/, 'Only @gmail.com or @yahoo.com addresses are allowed']
  },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' }, // Stores the super long Base64 image string
  
  //These are optional fields for the profile page
  age: { type: String, default: '' },
  occupation: { type: String, default: '' },
  cookingExp: { type: String, default: '' },
  allergies: { type: [String], default: [] },
  appliances: { type: [String], default: [] }
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' dates

module.exports = mongoose.model('User', userSchema);
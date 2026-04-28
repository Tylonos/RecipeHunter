
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, 
  email: {
    type: String,
    required: true,
    unique: true,
    // Forces Gmail/Yahoo only at the database level
    match: [/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/, 'Only @gmail.com or @yahoo.com addresses are allowed']
  },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  
  //Age 14-99
  age: { 
    type: Number, 
    min: [14, 'Age must be at least 14'], 
    max: [99, 'Age cannot exceed 99'],
    default: 18 
  },

  // Forces Occupation to be letters only
  occupation: { 
    type: String, 
    match: [/^[a-zA-Z\s]*$/, 'Occupation must not contain numbers'],
    default: '' 
  },

  // Stores the combined string (exp: "8 months")
  cookingExp: { type: String, default: '' },
  
  allergies: { type: [String], default: [] },
  appliances: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
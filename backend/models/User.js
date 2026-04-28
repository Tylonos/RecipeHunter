
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
    min: [14, 'Minors are not allowed.'], 
    max: [99, 'Invalid age.'] 
  },

  // Forces Occupation to be letters only
  occupation: { 
    type: String, 
    match: [/^[a-zA-Z\s]*$/, 'Occupation can only contain letters.'] 
  },

  // Stores the combined string (exp: "8 months")
  cookingExp: { type: String, default: '' },
  
  allergies: { type: [String], default: [] },
  appliances: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    // We added username and profilePicture here
    const { username, email, password, profilePicture } = req.body; 
    
    // Check if user or email already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ error: "Username or Email already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // We include username and profilePicture in the new User object
    const user = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      profilePicture 
    });
    
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    // This sends the specific error message to your console to help us debug
    res.status(500).json({ error: err.message }); 
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1d' });
    
    // We update the response to include the new username and profile picture
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        username: user.username, 
        profilePicture: user.profilePicture 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    ).select('-password'); // Don't send the password back
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
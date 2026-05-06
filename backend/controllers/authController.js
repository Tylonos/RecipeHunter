
const User = require('../models/User');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password, profilePicture } = req.body; 
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ error: "Username or Email already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      profilePicture 
    });
    await user.save();
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
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

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT_SECRET is not configured on the server' });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1d' });
    
    const safeUserDoc = await User.findById(user._id).select('-password');
    const safeUser = safeUserDoc?.toObject ? safeUserDoc.toObject() : safeUserDoc;
    if (safeUser) {
      if (!Array.isArray(safeUser.allergies)) safeUser.allergies = [];
      if (!Array.isArray(safeUser.diets)) safeUser.diets = [];
    }

    res.json({ 
      token, 
      user: safeUser,
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
      { new: true, runValidators: true }
    ).select('-password');

    const normalizedUser = updatedUser?.toObject ? updatedUser.toObject() : updatedUser;
    if (normalizedUser) {
      if (!Array.isArray(normalizedUser.allergies)) normalizedUser.allergies = [];
      if (!Array.isArray(normalizedUser.diets)) normalizedUser.diets = [];
    }

    res.json(normalizedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

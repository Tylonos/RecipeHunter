
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Tool to scramble/encrypt passwords
const jwt = require('jsonwebtoken'); //Tool to make "VIP passes" (tokens) for logged-in users

exports.register = async (req, res) => {
  try {
    //1. Grab all the info the user typed into the frontend form
    const { username, email, password, profilePicture } = req.body; 
    
    //2. Check the database to see if someone already took that email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ error: "Username or Email already taken" });

    // 3. Scramble the password so hackers can't read it (big brain moment)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    //4. Create the new user and save them to the database
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
    
    //1. Find the user by their email
    const user = await User.findOne({ email });
    
    //2. If the user doesn't exist, OR the password they typed doesn't match the scrambled one
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //3. Create a digital "VIP pass" (token) that proves they are logged in for the next 24 hours
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1d' });
    
    //4. Send the token and their profile info back to the frontend
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
    // Find the user by their ID, update whatever fields they changed, and return the new data
    // The '{ new: true }' part makes sure it gives us the updated version, not the old one
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    ).select('-password'); // '-password' hides the password from the response so it's safe

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
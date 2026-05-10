const jwt = require('jsonwebtoken');

//checks if the user is logged in
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; //is expecting "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; 
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

//Checks if the user is an admin
const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied. Admins only.' });
  }
};

module.exports = { verifyToken, verifyAdmin };

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Pulling in our route files so the server knows where to send traffic
const recipeRoutes = require('./routes/recipeRoutes');

//Firing up the Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Avoid Mongoose buffering queries when the DB isn't connected (fail fast instead of timing out).
mongoose.set('bufferCommands', false);

//CORS lets our frontend talk to the backend
// the express.json/urlencoded limits are bumped to 10mb so big profile pictures don't crash the server.
app.use(cors({
  origin: 'http://localhost:5001',
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Just a quick health check route to make sure the backend is alive
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Hooking up our actual API endpoints
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', require('./routes/userRoutes'));

console.log('MONGO_URI:', process.env.MONGO_URI ? '[provided]' : '[not set]');

// A helper function to actually turn the server on
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

//Here we try to connect to the MongoDB Atlas database using our secret key
const mongoUri = process.env.MONGO_URI;
if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => {
      console.log('Connected to MongoDB Atlas');
      startServer(); // Only start the server if the database connects successfully
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error.message || error);
      console.warn('Starting server without a MongoDB connection (read-only mode)');
      startServer();
    });
} else {
  // If we forgot to put the MONGO_URI in our .env file, it complains but still starts
  console.warn('No MONGO_URI provided — starting server without MongoDB (read-only mode)');
  startServer();
}

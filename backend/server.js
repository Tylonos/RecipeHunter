const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();


const recipeRoutes = require('./routes/recipeRoutes');

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors());
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.use('/api/recipes', recipeRoutes);
app.use('/api/users', require('./routes/userRoutes'));

console.log('MONGO_URI:', process.env.MONGO_URI ? '[provided]' : '[not set]');

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

const mongoUri = process.env.MONGO_URI;
if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => {
      console.log('Connected to MongoDB Atlas');
      startServer();
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error.message || error);
      console.warn('Starting server without a MongoDB connection (read-only mode)');
      startServer();
    });
} else {
  console.warn('No MONGO_URI provided — starting server without MongoDB (read-only mode)');
  startServer();
}
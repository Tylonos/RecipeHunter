
const mongoose = require('mongoose');
const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    ingredients: {
      type: [String],
      required: true,
      default: []
    },
    cooking_time: {
      type: Number,
      required: true
    },
    diet: {
      type: String,
      enum: ['vegetarian', 'vegan', ''],
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    image: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true 
  }
);

module.exports = mongoose.model('Recipe', recipeSchema);
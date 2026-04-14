
const mongoose = require('mongoose');

// Same as the User model, but this outlines how a Recipe is structured
const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true // Cuts off any accidental spaces at the start or end
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    ingredients: {
      type: [String], //An array of text strings
      required: true,
      default: []
    },
    cooking_time: {
      type: Number,
      required: true
    },
    diet: {
      type: String,
      enum: ['vegetarian', 'vegan', ''], // Only allows these exact words
      default: ''
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
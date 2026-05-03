const Recipe = require('../models/Recipe');
const { normalizeIngredientsInput } = require('../utils/ingredients');
const mongoose = require('mongoose');

const ensureDbConnected = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: 'Database not connected' });
    return false;
  }

  return true;
};

const getRecipes = async (req, res) => {
  try {
    if (!ensureDbConnected(res)) return;
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getRecipeById = async (req, res) => {
  try {
    if (!ensureDbConnected(res)) return;
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRecipe = async (req, res) => {
  try {
    if (!ensureDbConnected(res)) return;
    const { title, description, ingredients, cooking_time, image, diet } = req.body;

    const recipe = new Recipe({
      title,
      description,
      ingredients: normalizeIngredientsInput(ingredients), 
      cooking_time,
      diet,
      image
    });

    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    if (!ensureDbConnected(res)) return;
    const { title, description, ingredients, cooking_time, image, diet } = req.body;
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        ingredients: normalizeIngredientsInput(ingredients),
        cooking_time,
        image,
        diet
      },
      { new: true, runValidators: true }
    );

    if (!updatedRecipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getRecipes, getRecipeById, createRecipe, updateRecipe };

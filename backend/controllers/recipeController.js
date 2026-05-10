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
    const recipes = await Recipe.find({ status: 'approved' }).populate('createdBy', 'username').sort({ createdAt: -1 });
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
    
    // approved if created by an admin, otherwise pending
    const status = req.user.role === 'admin' ? 'approved' : 'pending';

    const recipe = new Recipe({
      title,
      description,
      ingredients: normalizeIngredientsInput(ingredients), 
      cooking_time,
      diet,
      image,
      createdBy: req.user.id, 
      status
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
    const { title, description, ingredients, cooking_time, image, diet, status } = req.body;

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const isAdmin = req.user && req.user.role === 'admin';
    const isOwner = req.user && String(recipe.createdBy) === String(req.user.id);
    if (!isAdmin && !isOwner) return res.status(403).json({ message: 'Not authorized to edit this recipe' });

    if (typeof title !== 'undefined') recipe.title = title;
    if (typeof description !== 'undefined') recipe.description = description;
    if (typeof ingredients !== 'undefined') recipe.ingredients = normalizeIngredientsInput(ingredients);
    if (typeof cooking_time !== 'undefined') recipe.cooking_time = cooking_time;
    if (typeof image !== 'undefined') recipe.image = image;
    if (typeof diet !== 'undefined') recipe.diet = diet;

    // If a non-admin owner edits a recipe, mark it pending for admin approval
    if (!isAdmin) {
      recipe.status = 'pending';
    } else if (typeof status !== 'undefined') {
      recipe.status = status;
    }

    const saved = await recipe.save();
    res.status(200).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyRecipes = async (req, res) => {
  try {
    if (!ensureDbConnected(res)) return;
    const recipes = await Recipe.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingRecipes = async (req, res) => {
  try {
    if (!ensureDbConnected(res)) return;
    const recipes = await Recipe.find({ status: 'pending' }).populate('createdBy', 'username').sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRecipeStatus = async (req, res) => {
  try {
    if (!ensureDbConnected(res)) return;
    const { status } = req.body; 
    
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const debugDb = async (req, res) => {
  try {
    if (!ensureDbConnected(res)) return;
    const total = await Recipe.countDocuments();
    const approved = await Recipe.countDocuments({ status: 'approved' });
    const pending = await Recipe.countDocuments({ status: 'pending' });
    const sample = await Recipe.find().limit(5).select('title status createdBy ingredients').lean();

    res.json({
      connected: mongoose.connection.readyState === 1,
      total,
      approved,
      pending,
      sample
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports ={ 
  getRecipes, 
  getRecipeById, 
  createRecipe, 
  updateRecipe,
  getMyRecipes,
  getPendingRecipes,
  updateRecipeStatus
  ,debugDb
};


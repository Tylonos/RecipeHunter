const express = require('express');
const router = express.Router();

//Grabbing all the recipe logic functions from the controller
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe
} = require('../controllers/recipeController');

// Map the different HTTP methods (GET for fetching, POST for creating, PUT for updating) to their logic
router.get('/', getRecipes);
router.get('/:id', getRecipeById);
router.post('/', createRecipe);
router.put('/:id', updateRecipe);

module.exports = router;
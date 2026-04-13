const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getRecipeById,
  createRecipe
} = require('../controllers/recipeController');

router.get('/', getRecipes);
router.get('/:id', getRecipeById);
router.post('/', createRecipe);

module.exports = router;
const express = require('express');
const router = express.Router();

const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe
} = require('../controllers/recipeController');

router.get('/', getRecipes);
router.get('/:id', getRecipeById);
router.post('/', createRecipe);
router.put('/:id', updateRecipe);

module.exports = router;
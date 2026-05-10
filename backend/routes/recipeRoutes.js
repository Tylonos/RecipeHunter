const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  getMyRecipes,
  getPendingRecipes,
  updateRecipeStatus
} = require('../controllers/recipeController');

//so anyone can see approved recipes
router.get('/', getRecipes);
router.get('/:id', getRecipeById);

router.post('/', verifyToken, createRecipe);
router.put('/:id', verifyToken, updateRecipe); 
router.get('/user/my-recipes', verifyToken, getMyRecipes);

//Admin routes
router.get('/admin/pending', verifyToken, verifyAdmin, getPendingRecipes);
router.put('/admin/status/:id', verifyToken, verifyAdmin, updateRecipeStatus);

module.exports = router;
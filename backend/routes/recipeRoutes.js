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
  getRejectedRecipes,
  updateRecipeStatus,
  debugDb
} = require('../controllers/recipeController');

//so anyone can see approved recipes
router.get('/', getRecipes);
router.get('/debug', debugDb);
router.post('/', verifyToken, createRecipe);
router.put('/:id', verifyToken, updateRecipe); 
router.get('/user/my-recipes', verifyToken, getMyRecipes);

//Admin routes (must be before '/:id')
router.get('/admin/pending', verifyToken, verifyAdmin, getPendingRecipes);
router.get('/admin/rejected', verifyToken, verifyAdmin, getRejectedRecipes);
router.put('/admin/status/:id', verifyToken, verifyAdmin, updateRecipeStatus);

// specific id route should come after admin and other static routes
router.get('/:id', getRecipeById);

module.exports = router;
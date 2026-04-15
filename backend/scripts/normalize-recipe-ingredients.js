/* eslint-disable no-console */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const { normalizeIngredientsInput } = require('../utils/ingredients');

// Helper to check if two arrays are exactly the same
function arraysEqual(a, b) {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

//This script loops through ALL recipes in the database to fix any old, messy ingredients 
// - that were added before we built the "Text Cleaner" above.
async function main() {
  // If we run this script with '--dry-run', it just tells us what it WOULD fix without actually changing the DB
  const dryRun = process.argv.includes('--dry-run');
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('Missing MONGO_URI in environment.');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  const recipes = await Recipe.find();
  let updatedCount = 0;

  for (const recipe of recipes) {
    const current = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    const normalized = normalizeIngredientsInput(current); // Run them through the cleaner

    // If it's already clean, skip it
    if (arraysEqual(current, normalized)) continue;

    //If it's dirty, save the clean version back to the database
    updatedCount += 1;
    if (!dryRun) {
      recipe.ingredients = normalized;
      await recipe.save();
    }
  }

  console.log(
    dryRun
      ? `Dry run: would update ${updatedCount} recipe(s).`
      : `Updated ${updatedCount} recipe(s).`
  );

  await mongoose.disconnect();
}

// Runs the script
main().catch((err) => {
  console.error(err);
  process.exit(1);
});

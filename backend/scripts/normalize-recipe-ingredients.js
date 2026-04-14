/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const { normalizeIngredientsInput } = require('../utils/ingredients');

function arraysEqual(a, b) {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

async function main() {
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
    const normalized = normalizeIngredientsInput(current);

    if (arraysEqual(current, normalized)) {
      continue;
    }

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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


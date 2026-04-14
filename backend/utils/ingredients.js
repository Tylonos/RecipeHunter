// This file is essentially a "car wash" for text. People type messy ingredients, this makes them neat (gen z word)

// Turns double spaces/tabs into single spaces and chops off spaces at the ends
function collapseWhitespace(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

//Removes any annoying brackets like () [] {}
function stripBracketChars(value) {
  return String(value ?? '').replace(/[()[\]{}]/g, '');
}

//If someone types "Butter or Margarine", this splits it into two separate valid options
function splitOrChoices(value) {
  const cleaned = collapseWhitespace(stripBracketChars(value));
  if (!cleaned) return [];

  if (!/\s+\bor\b\s+/i.test(cleaned)) return [cleaned];

  return cleaned
    .split(/\s+\bor\b\s+/i)
    .map((item) => collapseWhitespace(item))
    .filter(Boolean);
}

// Splits a long list separated by commas or semicolons into a nice, clean array
function splitIngredientEntries(entry) {
  return collapseWhitespace(stripBracketChars(entry))
    .split(/[,;\n]+/g)
    .map((item) => collapseWhitespace(item))
    .filter(Boolean)
    .flatMap((item) => splitOrChoices(item)); // Also runs the "or" splitter on them
}

// The main function that gets exported and used by the recipeController
function normalizeIngredientsInput(input) {
  const list = Array.isArray(input) ? input : [input];

  return list
    .flatMap((entry) => splitIngredientEntries(entry))
    .filter(Boolean);
}

module.exports = { normalizeIngredientsInput };
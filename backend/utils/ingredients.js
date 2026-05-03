function collapseWhitespace(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function stripBracketChars(value) {
  return String(value ?? '').replace(/[()[\]{}]/g, '');
}

function splitOrChoices(value) {
  const cleaned = collapseWhitespace(stripBracketChars(value));
  if (!cleaned) return [];

  if (!/\s+\bor\b\s+/i.test(cleaned)) return [cleaned];

  return cleaned
    .split(/\s+\bor\b\s+/i)
    .map((item) => collapseWhitespace(item))
    .filter(Boolean);
}

function splitIngredientEntries(entry) {
  return collapseWhitespace(stripBracketChars(entry))
    .split(/[,;\n]+/g)
    .map((item) => collapseWhitespace(item))
    .filter(Boolean)
    .flatMap((item) => splitOrChoices(item));
}

function normalizeIngredientsInput(input) {
  const list = Array.isArray(input) ? input : [input];

  return list
    .flatMap((entry) => splitIngredientEntries(entry))
    .filter(Boolean);
}

module.exports = { normalizeIngredientsInput };
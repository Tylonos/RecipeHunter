// Utility: collapse multiple whitespace characters into a single space
function collapseWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

// Utility: remove bracket characters so "(fresh)" or "[optional]" doesn't leak into UI matching
function stripBracketChars(value) {
  return value.replace(/[()[\]{}]/g, '');
}

// Utility: basic singularization for common English plurals (best-effort, not perfect grammar)
function singularizeWord(word) {
  const w = word.toLowerCase();

  if (w.length <= 2) {
    return w;
  }

  // Avoid breaking common endings that aren't simple plurals.
  if (w.endsWith('ss') || w.endsWith('us') || w.endsWith('is')) {
    return w;
  }

  // berries -> berry
  if (w.endsWith('ies') && w.length > 3) {
    return `${w.slice(0, -3)}y`;
  }

  // tomatoes -> tomato
  if (w.endsWith('oes') && w.length > 3) {
    return w.slice(0, -2);
  }

  // dishes -> dish, classes -> class, sauces -> sauce
  if (
    (w.endsWith('ches') && w.length > 4) ||
    (w.endsWith('shes') && w.length > 4) ||
    (w.endsWith('sses') && w.length > 4) ||
    (w.endsWith('xes') && w.length > 3) ||
    (w.endsWith('zes') && w.length > 3) ||
    (w.endsWith('ses') && w.length > 3)
  ) {
    return w.slice(0, -2);
  }

  // carrots -> carrot
  if (w.endsWith('s')) {
    return w.slice(0, -1);
  }

  return w;
}

// Utility: singularize the last word of a phrase ("olive oils" -> "olive oil")
function singularizePhrase(phrase) {
  const cleaned = collapseWhitespace(stripBracketChars(phrase));
  if (!cleaned) {
    return '';
  }

  const parts = cleaned.split(' ');
  if (parts.length === 1) {
    return singularizeWord(parts[0]);
  }

  const last = parts[parts.length - 1];
  return [...parts.slice(0, -1), singularizeWord(last)].join(' ');
}

// Utility: capitalize only the first character ("tomato" -> "Tomato")
function toSentenceCase(value) {
  if (!value) {
    return '';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

// Normalize an ingredient into a stable key (for matching) and a display label (for UI)
export function normalizeIngredient(raw) {
  const base = singularizePhrase(String(raw ?? ''));
  const key = base.toLowerCase();
  const label = toSentenceCase(key);
  return { key, label };
}

// Split raw ingredient input into separate entries (commas/semicolons/newlines and simple "x or y")
export function splitIngredientEntries(entry) {
  const parts = String(entry ?? '')
    .split(/[,;\n]+/g)
    .map((item) => collapseWhitespace(stripBracketChars(item)))
    .filter(Boolean);

  const flattened = [];
  parts.forEach((part) => {
    // Turn "milk or cream" into ["milk", "cream"]
    if (/\s+\bor\b\s+/i.test(part)) {
      part
        .split(/\s+\bor\b\s+/i)
        .map((item) => collapseWhitespace(item))
        .filter(Boolean)
        .forEach((item) => flattened.push(item));
      return;
    }

    flattened.push(part);
  });

  return flattened;
}

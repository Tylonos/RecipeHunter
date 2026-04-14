function collapseWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function stripBracketChars(value) {
  return value.replace(/[()[\]{}]/g, '');
}

function singularizeWord(word) {
  const w = word.toLowerCase();

  if (w.length <= 2) {
    return w;
  }


  if (w.endsWith('ss') || w.endsWith('us') || w.endsWith('is')) {
    return w;
  }

  if (w.endsWith('ies') && w.length > 3) {
    return `${w.slice(0, -3)}y`;
  }

  if (w.endsWith('oes') && w.length > 3) {
    return w.slice(0, -2); 
  }

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

  if (w.endsWith('s')) {
    return w.slice(0, -1);
  }

  return w;
}

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

function toSentenceCase(value) {
  if (!value) {
    return '';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function normalizeIngredient(raw) {
  const base = singularizePhrase(String(raw ?? ''));
  const key = base.toLowerCase();
  const label = toSentenceCase(key);
  return { key, label };
}

export function splitIngredientEntries(entry) {
  const parts = String(entry ?? '')
    .split(/[,;\n]+/g)
    .map((item) => collapseWhitespace(stripBracketChars(item)))
    .filter(Boolean);

  const flattened = [];
  parts.forEach((part) => {
    // Split simple "x or y" into two separate ingredients (and drop "or")
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

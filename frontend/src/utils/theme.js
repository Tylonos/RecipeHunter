const THEME_STORAGE_KEY = 'recipehunter-theme';

export function getStoredTheme() {
  const value = localStorage.getItem(THEME_STORAGE_KEY);
  if (value === 'light' || value === 'dark') {
    return value;
  }
  return null;
}

export function getSystemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getEffectiveTheme(storedTheme) {
  return storedTheme ?? getSystemTheme();
}

export function setStoredTheme(theme) {
  if (theme === 'light' || theme === 'dark') {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    return;
  }
  localStorage.removeItem(THEME_STORAGE_KEY);
}

export function applyTheme(storedTheme) {
  if (typeof document === 'undefined') {
    return;
  }

  if (storedTheme === 'light' || storedTheme === 'dark') {
    document.documentElement.dataset.theme = storedTheme;
  } else {
    delete document.documentElement.dataset.theme;
  }
}


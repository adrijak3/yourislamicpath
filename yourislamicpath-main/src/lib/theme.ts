export type AppTheme = "light" | "midnight" | "sepia" | "garden";

const STORAGE_KEY = "guided-path-theme";

export function applyTheme(theme: AppTheme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
}

export function getSavedTheme(): AppTheme {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (
    saved === "light" ||
    saved === "midnight" ||
    saved === "sepia" ||
    saved === "garden"
  ) {
    return saved;
  }

  return "light";
}

export const THEMES = {
  light: 'light',
  dark: 'dark',
} as const;
export type Theme = keyof typeof THEMES;

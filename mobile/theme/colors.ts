export const colors = {
  background: '#FAF9F6', // Warm Cream
  border: '#3D405B', // Dark Talavera Blue
  primary: '#E07A5F', // Terracotta
  secondary: '#F2CC8F', // Mustard Yellow
  accent1: '#FF007F', // Fuchsia
  accent2: '#40E0D0', // Turquoise
} as const;

export type ColorType = keyof typeof colors;

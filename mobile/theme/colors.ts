export const colors = {
  background: '#FAF9F6', // Warm Cream
  border: '#3D405B', // Dark Talavera Blue
  primary: '#E07A5F', // Terracotta
  secondary: '#F2CC8F', // Mustard Yellow
  accent1: '#F15BB5', // Vibrant Magenta / Fucsia Festivo
  accent2: '#00F5D4', // Vivid Turquoise / Cian Vivo
} as const;

export type ColorType = keyof typeof colors;

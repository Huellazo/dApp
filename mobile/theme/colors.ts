export const colors = {
  background: '#FAF9F6', // Warm Cream (Crema Cálido)
  border: '#3D405B', // Dark Talavera Blue (Azul Talavera Oscuro)
  primary: '#E07A5F', // Terracotta (Terracota)
  secondary: '#F2CC8F', // Mustard Yellow (Amarillo Mostaza)
  accent1: '#D81B60', // Festive Magenta (Fucsia Festivo - desaturado suave)
  accent2: '#00A896', // Deep Turquoise (Turquesa Orgánico - desaturado suave)
} as const;

export type ColorType = keyof typeof colors;

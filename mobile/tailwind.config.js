/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#FAF9F6', // Crema Cálido
        border: '#3D405B', // Azul Talavera Oscuro
        primary: '#E07A5F', // Terracota
        secondary: '#F2CC8F', // Amarillo Mostaza
        accent1: '#D81B60', // Fucsia Festivo Suave
        accent2: '#00A896', // Turquesa Orgánico
      },
      borderWidth: {
        '4': '4px',
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #3D405B',
        'brutal-sm': '2px 2px 0px 0px #3D405B',
        'brutal-lg': '6px 6px 0px 0px #3D405B',
      },
      elevation: {
        'brutal': '4',
        'brutal-sm': '2',
        'brutal-lg': '6',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pokeRed: "#E3352B",
        pokeCream: "#F7F0D8",
        pokeMidnight: "#101827",
        pokeBlue: "#2A75BB",
      },
    },
  },
  plugins: [],
};
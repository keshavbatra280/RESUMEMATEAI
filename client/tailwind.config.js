/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4F6F8",
        ink: "#0F1F2E",
        brand: { DEFAULT: "#2B3BE0", dark: "#1F2CB5", soft: "#E8EAFD" },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        body: ["Figtree", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

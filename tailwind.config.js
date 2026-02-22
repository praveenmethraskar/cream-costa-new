// // tailwind.config.js
// module.exports = {
//   darkMode: "class", // <-- enable class-based dark mode
//   content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };

// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/presentation/**/*.{js,ts,jsx,tsx}",
    "./src/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        bg_image: "url('/bg-4.jpg')",
      },
    },
  },
  plugins: [],
};

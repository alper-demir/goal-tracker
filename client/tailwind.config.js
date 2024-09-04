/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1', // Default light mode color
          dark: '#3f3f3f',   // Dark mode color
        },
        secondary: {
          DEFAULT: '#D8005A',
          dark: '#7F1D1D',
        },
        background: {
          light: '#ffffff',  // Background for light mode
          dark: '#101010',   // Background for dark mode
        },
        border: {
          light: '#6366F1',  // Border color for light mode
          dark: '#3f3f3f',   // Border color for dark mode
        },
        text: {
          light: "#000000",
          dark: "#f1f1f1"
        },
        progressBg: {
          light: "#E5E7EB",
          dark: "#3f3f3f"
        },
        hover: {
          light: "#E5E7EB",
          dark: "#232323",
        }
      },
    },
  },
  plugins: [],
  darkMode: "class"
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Lato',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      colors: {
        // Add custom colors as needed
      },
      spacing: {
        // Add custom spacing as needed
      },
    },
  },
  plugins: [],
}

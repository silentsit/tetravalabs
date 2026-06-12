/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@medusajs/ui-preset")],
  content: [
    "./src/admin/**/*.{js,jsx,ts,tsx}",
    // Forward slashes required — path.join() breaks Tailwind globs on Windows.
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {}
  },
  plugins: []
}

const path = require("path")

module.exports = {
  presets: [require("@medusajs/ui-preset")],
  content: [
    "./src/admin/**/*.{js,jsx,ts,tsx}",
    path.join(
      path.dirname(require.resolve("@medusajs/ui")),
      "../..",
      "**/*.{js,jsx,ts,tsx}"
    )
  ],
  darkMode: "class",
  theme: {
    extend: {}
  },
  plugins: []
}

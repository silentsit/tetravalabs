import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#050508",
        surface: "#0A0A10",
        text: {
          primary: "#E8E8F0",
          secondary: "#8A8AA0"
        },
        accent: {
          teal: "#5EEAD4",
          purple: "#A78BFA",
          warning: "#FBBF24"
        }
      }
    }
  },
  plugins: []
}

export default config

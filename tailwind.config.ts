import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        colors: {
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          border: "hsl(var(--border))",
          gold: {
            light: "#f9d976",
            dark: "#b8860b",
          },
          silver: {
            light: "#e0e0e0",
            dark: "#a0a0a0",
          },
          bronze: {
            light: "#cd7f32",
            dark: "#8c6239",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

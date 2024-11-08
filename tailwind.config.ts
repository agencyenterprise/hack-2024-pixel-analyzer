import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: "class",
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Cinzel", ...fontFamily.sans],
        second: ["Quicksand", ...fontFamily.sans],
      },
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        border: "rgb(var(--border))",
        gold: "rgb(var(--gold))",
        silver: "rgb(var(--silver))",
        bronze: "rgb(var(--bronze))",
      },
    },
  },
  plugins: [],
} satisfies Config;

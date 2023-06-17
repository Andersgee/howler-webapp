import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
      },
      boxShadow: {
        imageborder: "inset 0 2px 4px 0 hsla(0, 0%, 0%, .2)",
      },
    },
  },
  plugins: [],
} satisfies Config;

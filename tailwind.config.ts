import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f7fb",
          100: "#e5ecf6",
          200: "#c7d7ea",
          300: "#9fbadb",
          400: "#7096c6",
          500: "#4c76ab",
          600: "#3a5c8a",
          700: "#304a6f",
          800: "#2a3e5c",
          900: "#26354e",
        },
        celebrate: {
          50: "#fdf6ec",
          100: "#faead0",
          200: "#f3d29e",
          300: "#eab566",
          400: "#e29a3a",
          500: "#d17f22",
          600: "#b0631b",
          700: "#8c4c1a",
          800: "#733e1a",
          900: "#623519",
        },
      },
      keyframes: {
        "card-flip": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.92)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "card-flip": "card-flip 0.5s ease-in-out",
        "pop-in": "pop-in 0.35s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;

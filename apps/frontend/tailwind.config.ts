import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B2E4F",
        accent: "#1F8A70",
        surface: "#F4F7FB",
        danger: "#A63D40"
      }
    }
  },
  plugins: []
};

export default config;

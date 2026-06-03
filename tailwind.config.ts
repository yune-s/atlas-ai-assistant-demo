import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        atlas: {
          ink: "#14213d",
          green: "#0f8b6f",
          red: "#c53030",
          mint: "#e8f6f1",
          paper: "#fafafa",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(20, 33, 61, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;

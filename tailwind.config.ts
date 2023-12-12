import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
    keyframes: {
      marquee: {
        "0%": { transform: "translateX(0)" },
        "100%": { transform: "translateX(-100%)" },
      },
      latemarquee: {
        "0%": { transform: "translateX(100%)" },
        "100%": { transform: "translateX(0)" },
      },
    },
    animation: {
      marquee: "marquee 20s linear infinite",
      latemarquee: "latemarquee 20s linear infinite",
    },
    boxShadow: {
      material:
        "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
      md: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      sm: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
    },
  },
  plugins: [],
};
export default config;

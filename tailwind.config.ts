import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#07883f", dark: "#066d33", soft: "#e4f3e9" },
        up: "#dc2626",
        down: "#16a34a",
        page: "#f1f5f0",
        card: "#fafcf9",
        line: "#e3e9e1",
      },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
      animation: { marquee: "marquee 70s linear infinite" },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070A10",
        ink2: "#0B1018",
        ink3: "#10161F",
        gold: "#E5C87A",
        goldMuted: "#A89058",
        bone: "#E8E2D2",
        mist: "#8A8E96",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        label: ['"Syne"', "sans-serif"],
        body: ['"DM Sans"', "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.32em",
      },
      maxWidth: {
        prose2: "62ch",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 700ms cubic-bezier(0.2, 0.7, 0.2, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;

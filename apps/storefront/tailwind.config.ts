import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mejunje: {
          bg: "#FAF8F5", // Luminous warm white / raw cotton
          paper: "#F4EFE6", // Natural handmade paper
          card: "#FFFFFF",
          border: "#E7DFC6",
          borderLight: "#F0EAE1",
          amber: "#C87D38",
          amberDark: "#9E5A20",
          amberLight: "#F8EBDD",
          sage: "#8F9E84",
          sageLight: "#EBF0E7",
          sageDark: "#5C6B52",
          olive: "#707A5E",
          deepGreen: "#2E3D2F",
          forest: "#1D281E",
          terracotta: "#BC6C4D",
          terracottaLight: "#F7ECE7",
          clayRed: "#9E4738",
          mustard: "#D4A346",
          mustardLight: "#FDF5E2",
          charcoal: "#201F1D",
          ink: "#2B2927",
          muted: "#6B6760",
          subtle: "#9C9890",
        },
      },
      fontFamily: {
        typewriter: ['"Courier Prime"', '"Special Elite"', 'Courier', 'monospace'],
        editorial: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        editorial: "0 10px 30px -10px rgba(43, 41, 39, 0.07)",
        cardHover: "0 18px 40px -12px rgba(43, 41, 39, 0.12)",
        drawer: "-10px 0 40px 0 rgba(32, 31, 29, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mejunje: {
          // Base
          blanco: "#FFFFFF",
          blancocalido: "#FCFAF7",
          marfil: "#F6F1E9",
          beige: "#E7DDD0",
          arena: "#D7C6B5",
          papel: "#F7F4EE",

          // Verdes
          salvia: "#A2AD94",
          verdeseco: "#7D8972",
          oliva: "#92966D",
          verdeprofundo: "#58604E",
          salviaoscura: "#58604E", // alias for compatibility
          salviaclara: "#A2AD94",  // alias

          // Ámbar / Amarillo
          ambar: "#D5A24C",
          mostaza: "#D9B568",
          amarillobotanico: "#E2C979",

          // Naranja / Terracota / Arcilla
          terracota: "#C87955",
          naranjaquemado: "#D28A4A",
          arcilla: "#BC735B",
          salmon: "#C87955", // alias
          blush: "#BC735B",  // alias

          // Rojo / Alerta
          rojo: "#A95F52",
          rojoladrillo: "#A95F52",
          rojovino: "#875B57",

          // Textos
          carbon: "#282522",
          tinta: "#282522",
          griscalido: "#716A63",
          secundario: "#716A63",
          tabaco: "#44403C",
          espresso: "#282522",

          // UI Surface & Borders
          card: "#FFFFFF",
          border: "#E7DDD0",
          borderarena: "#D7C6B5",
        },
      },
      fontFamily: {
        typewriter: ['"Courier Prime"', '"Special Elite"', 'Courier', 'monospace'],
        typewriterElite: ['"Special Elite"', '"Courier Prime"', 'Courier', 'monospace'],
        serif: ['"Newsreader"', '"EB Garamond"', 'Georgia', 'serif'],
        sans: ['"Courier Prime"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'monospace'],
      },
      boxShadow: {
        'atelier': '0 1px 3px 0 rgba(40, 37, 34, 0.04), 0 1px 2px -1px rgba(40, 37, 34, 0.04)',
        'atelier-md': '0 4px 8px -1px rgba(40, 37, 34, 0.06), 0 2px 4px -2px rgba(40, 37, 34, 0.06)',
        'atelier-lg': '0 10px 20px -3px rgba(40, 37, 34, 0.07), 0 4px 6px -4px rgba(40, 37, 34, 0.07)',
        'fichapapel': '0 2px 6px 0 rgba(40, 37, 34, 0.05)',
      }
    },
  },
  plugins: [],
};

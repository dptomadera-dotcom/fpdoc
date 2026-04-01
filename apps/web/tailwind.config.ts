import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Industrial / Woodworking Palette
        brand: {
          walnut: "#3E2723", // Deep wood
          mahogany: "#5D4037",
          maple: "#F5F5DC",   // Creamy wood
          oak: "#A1887F",    // Light wood
          steel: "#455A64",  // Brushed steel
          forest: "#2E7D32", // Success/Woodland
          amber: "#FFB300",  // Caution
          blood: "#C62828",  // Error
        },
        card: {
          DEFAULT: "var(--card-bg)",
          foreground: "var(--card-fg)",
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
} satisfies Config;

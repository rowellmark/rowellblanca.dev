const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'primary': '#1a191d',
        'primary-accent': '#0e0e0e',
        'text-accent': '#8C8F98',
        'accent-color': '#F8C15F',
        'accent-color-slate': '#E7A737',
        'brand-bg': '#FAFAF7',
        'brand-surface': '#FFFFFF',
        'brand-muted': '#F8FAFC',
        'brand-navy': '#0F172A',
        'brand-slate': '#475569',
        'brand-amber': '#F59E0B',
        'brand-amber-h': '#D97706',
        'brand-violet': '#7C3AED',
        'brand-sky': '#0EA5E9',
        'brand-emerald': '#10B981',
        'brand-border': '#E2E8F0',
      },
      animation: {
        "meteor-effect": "meteor 5s linear infinite",
      },
      keyframes: {
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
      },
    },

  },
  plugins: [addVariablesForColors],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
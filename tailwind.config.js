/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
        ],
      },
      fontSize: {
        "display-xl": ["clamp(40px, 5vw + 1rem, 64px)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-l":  ["clamp(36px, 4vw + 1rem, 52px)", { lineHeight: "1.12", letterSpacing: "-0.015em", fontWeight: "600" }],
        h1:           ["clamp(32px, 3.5vw + 0.5rem, 44px)", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }],
        h2:           ["clamp(26px, 2.5vw + 0.5rem, 36px)", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
        h3:           ["clamp(22px, 2vw + 0.25rem, 28px)", { lineHeight: "1.25", fontWeight: "600" }],
        h4:           ["22px", { lineHeight: "1.3", fontWeight: "500" }],
        "body-lg":    ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        body:         ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        caption:      ["14px", { lineHeight: "1.45", fontWeight: "400" }],
      },
      maxWidth: {
        prose: "720px",
      },
    },
  },
  plugins: [],
};

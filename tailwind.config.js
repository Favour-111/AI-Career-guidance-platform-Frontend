/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F2854",
          50: "#EBF0FA",
          100: "#C8D5ED",
          200: "#A2B8DF",
          300: "#7A9AD0",
          400: "#4988C4",
          500: "#2E6BAD",
          600: "#1C4D8D",
          700: "#153E72",
          800: "#0F2854",
          900: "#091B3A",
        },
        secondary: {
          DEFAULT: "#1C4D8D",
          light: "#4988C4",
          dark: "#153E72",
        },
        accent: "#091B3A",
        surface: "#f0f7ff",
        dark: {
          bg: "#060E1F",
          surface: "#0B1830",
          card: "#101E3A",
          border: "#1A3060",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 15px rgba(15, 40, 84, 0.08)",
        "card-hover": "0 8px 30px rgba(15, 40, 84, 0.16)",
        glow: "0 0 20px rgba(73, 136, 196, 0.35)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "pulse-slow": "pulse 3s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

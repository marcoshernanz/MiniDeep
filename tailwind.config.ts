const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "rgb(var(--popover))",
          foreground: "rgb(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "rgb(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "rgb(var(--success))",
          foreground: "rgb(var(--success-foreground))",
        },
        link: "rgb(var(--link))",
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))",

        red: { DEFAULT: "rgb(var(--red))" },
        orange: { DEFAULT: "rgb(var(--orange))" },
        amber: { DEFAULT: "rgb(var(--amber))" },
        yellow: { DEFAULT: "rgb(var(--yellow))" },
        lime: { DEFAULT: "rgb(var(--lime))" },
        green: { DEFAULT: "rgb(var(--green))" },
        emerald: { DEFAULT: "rgb(var(--emerald))" },
        teal: { DEFAULT: "rgb(var(--teal))" },
        cyan: { DEFAULT: "rgb(var(--cyan))" },
        sky: { DEFAULT: "rgb(var(--sky))" },
        blue: { DEFAULT: "rgb(var(--blue))" },
        indigo: { DEFAULT: "rgb(var(--indigo))" },
        violet: { DEFAULT: "rgb(var(--violet))" },
        purple: { DEFAULT: "rgb(var(--purple))" },
        fuchsia: { DEFAULT: "rgb(var(--fuchsia))" },
        pink: { DEFAULT: "rgb(var(--pink))" },
        rose: { DEFAULT: "rgb(var(--rose))" },
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

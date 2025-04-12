import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "hsl(var(--secondary) / 0.95)",
          100: "hsl(var(--secondary) / 0.9)",
          200: "hsl(var(--secondary) / 0.8)",
          300: "hsl(var(--secondary) / 0.7)",
          400: "hsl(var(--secondary) / 0.6)",
          500: "hsl(var(--secondary))",
          600: "hsl(var(--secondary) / 0.85)",
          700: "hsl(var(--secondary) / 0.7)",
          800: "hsl(var(--secondary) / 0.5)",
          900: "hsl(var(--secondary) / 0.4)",
          950: "hsl(var(--secondary) / 0.3)",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",  // Ajout de la couleur bleue
          foreground: "hsl(var(--tertiary-foreground))",
          50: "hsl(var(--tertiary) / 0.95)",
          100: "hsl(var(--tertiary) / 0.9)",
          200: "hsl(var(--tertiary) / 0.8)",
          300: "hsl(var(--tertiary) / 0.7)",
          400: "hsl(var(--tertiary) / 0.6)",
          500: "hsl(var(--tertiary)",
          600: "hsl(var(--stertiary) / 0.7)",
          800: "hsl(var(--tertiary) / 0.5)",
          900: "hsl(var(--tertiary) / 0.4)",
          950: "hsl(var(--tertiary) / 0.3)",
        },
        quaternary: {
          DEFAULT: "hsl(var(--quaternary))", // Ajout de la couleur verte
          foreground: "hsl(var(--quaternary-foreground))",
          50: "hsl(var(--quaternary) / 0.95)",
          100: "hsl(var(--quaternary) / 0.9)",
          200: "hsl(var(--quaternary) / 0.8)",
          300: "hsl(var(--quaternary) / 0.7)",
          400: "hsl(var(--quaternary) / 0.6)",
          500: "hsl(var(--quaternary))",
          600: "hsl(var(--quaternary) / 0.85)",
          700: "hsl(var(--quaternary) / 0.7)",
          800: "hsl(var(--quaternary) / 0.5)",
          900: "hsl(var(--quaternary) / 0.4)",
          950: "hsl(var(--quaternary) / 0.3)",
        },
        quinary: {
          DEFAULT: "hsl(var(--quinary))",   // Ajout de la couleur jaune
          foreground: "hsl(var(--quinary-foreground))",
          50: "hsl(var(--quinary) / 0.95)",
          100: "hsl(var(--quinary) / 0.9)",
          200: "hsl(var(--quinary) / 0.8)",
          300: "hsl(var(--quinary) / 0.7)",
          400: "hsl(var(--quinary) / 0.6)",
          500: "hsl(var(--quinary))",
          600: "hsl(var(--quinary) / 0.85)",
          700: "hsl(var(--quinary) / 0.7)",
          800: "hsl(var(--quinary) / 0.5)",
          900: "hsl(var(--quinary) / 0.4)",
          950: "hsl(var(--quinary) / 0.3)",
        },
        senary: {
          DEFAULT: "hsl(var(--senary))",     // Ajout de la couleur grise
          foreground: "hsl(var(--senary-foreground))",
          50: "hsl(var(--senary) / 0.95)",
          100: "hsl(var(--senary) / 0.9)",
          200: "hsl(var(--senary) / 0.8)",
          300: "hsl(var(--senary) / 0.7)",
          400: "hsl(var(--senary) / 0.6)",
          500: "hsl(var(--senary))",
          600: "hsl(var(--senary) / 0.85)",
          700: "hsl(var(--senary) / 0.7)",
          800: "hsl(var(--senary) / 0.5)",
          900: "hsl(var(--senary) / 0.4)",
          950: "hsl(var(--senary) / 0.3)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s ease-out",
        "fade-down": "fade-down 0.5s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
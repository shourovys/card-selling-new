/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}',
	],
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
        // MUI border color: #E0E0E0
        border: "hsl(var(--border))",
        // MUI input colors from theme.palette.input
        input: {
          // MUI input.default: #FCFCFC
          background: "hsl(var(--input-background))",
          // MUI input.border: #E0E0E0
          border: "hsl(var(--input-border))",
          // MUI input.borderHover: #BDBDBD
          borderHover: "hsl(var(--input-border-hover))",
          // MUI input.borderFocused: #0066cc
          borderFocus: "hsl(var(--input-border-focus))"
        },
        // MUI secondary.main: #0066cc
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        // MUI text.main: #222222
        foreground: "hsl(var(--foreground))",
        primary: {
          // MUI primary.main: #FC2861
          DEFAULT: "hsl(var(--primary))",
          // MUI primary.contrastText: #fff
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          // MUI secondary.main: #0066cc
          DEFAULT: "hsl(var(--secondary))",
          // MUI secondary.contrastText: #fff
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: {
          // MUI success.main: #65e023
          DEFAULT: "hsl(var(--success))",
          // MUI success.contrastText: #fff
          foreground: "hsl(var(--success-foreground))",
        },
        destructive: {
          // MUI error.main: #FF0000
          DEFAULT: "hsl(var(--destructive))",
          // MUI error.contrastText: #fff
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          // MUI disabled background: #F5F5F5
          DEFAULT: "hsl(var(--muted))",
          // MUI text.disabled: #666666
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          // Same as primary for brand consistency
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
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

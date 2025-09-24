import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        // ML-specific colors for the prediction system
        ml: {
          primary: "hsl(var(--ml-primary))",
          "primary-dark": "hsl(var(--ml-primary-dark))",
          "primary-light": "hsl(var(--ml-primary-light))",
          secondary: "hsl(var(--ml-secondary))",
          "secondary-light": "hsl(var(--ml-secondary-light))",
          accent: "hsl(var(--ml-accent))",
          "accent-light": "hsl(var(--ml-accent-light))",
        },
        // Algorithm-specific colors
        arima: "hsl(var(--arima-color))",
        lstm: "hsl(var(--lstm-color))",
        // Status colors
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        error: "hsl(var(--error))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        // ML-themed animations
        "ml-pulse": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.05)",
          },
        },
        "data-flow": {
          "0%": {
            transform: "translateX(-100%)",
            opacity: "0",
          },
          "50%": {
            opacity: "1",
          },
          "100%": {
            transform: "translateX(100%)",
            opacity: "0",
          },
        },
        "neural-glow": {
          "0%, 100%": {
            boxShadow: "0 0 5px hsl(var(--ml-accent))",
          },
          "50%": {
            boxShadow: "0 0 20px hsl(var(--ml-accent)), 0 0 30px hsl(var(--ml-accent))",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "ml-pulse": "ml-pulse 2s ease-in-out infinite",
        "data-flow": "data-flow 3s ease-in-out infinite",
        "neural-glow": "neural-glow 2s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-ml": "var(--gradient-primary)",
        "gradient-data": "var(--gradient-data)",
        "gradient-neural": "var(--gradient-neural)",
        "gradient-hero": "var(--gradient-hero)",
      },
      boxShadow: {
        "ml": "var(--shadow-ml)",
        "neural": "var(--shadow-neural)",
        "data": "var(--shadow-data)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

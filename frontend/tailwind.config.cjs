/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Typography - Google Sans with fallbacks
      fontFamily: {
        sans: [
          '"Google Sans"',
          "Roboto",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        display: ['"Google Sans"', "Roboto", "sans-serif"],
        mono: ['"Google Sans Mono"', '"Roboto Mono"', "monospace"],
      },

      // Material Design 3 Colors
      colors: {
        // Primary - Google Blue
        primary: {
          DEFAULT: "#1a73e8",
          light: "#4285f4",
          dark: "#1557b0",
          container: "#d3e3fd",
          50: "#e8f0fe",
          100: "#d3e3fd",
          200: "#aecbfa",
          300: "#8ab4f8",
          400: "#669df6",
          500: "#4285f4",
          600: "#1a73e8",
          700: "#1557b0",
          800: "#174ea6",
          900: "#0d47a1",
        },

        // Surface colors
        surface: {
          primary: "#ffffff",
          secondary: "#f8f9fa",
          tertiary: "#f1f3f4",
          elevated: "#ffffff",
          dim: "#e8eaed",
        },

        // Text colors following MD3
        onSurface: {
          DEFAULT: "#202124",
          variant: "#5f6368",
          muted: "#80868b",
          disabled: "#9aa0a6",
        },

        // Semantic states
        success: {
          DEFAULT: "#1e8e3e",
          container: "#e6f4ea",
        },
        warning: {
          DEFAULT: "#f9ab00",
          container: "#fef7e0",
        },
        error: {
          DEFAULT: "#d93025",
          container: "#fce8e6",
        },

        // Borders
        outline: {
          DEFAULT: "#dadce0",
          variant: "#e8eaed",
        },
      },

      // Material Design 3 Shadows/Elevation
      boxShadow: {
        "elevation-0": "none",
        "elevation-1":
          "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
        "elevation-2":
          "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15)",
        "elevation-3":
          "0 4px 8px 3px rgba(60, 64, 67, 0.15), 0 1px 3px 0 rgba(60, 64, 67, 0.3)",
        "elevation-4":
          "0 6px 10px 4px rgba(60, 64, 67, 0.15), 0 2px 3px 0 rgba(60, 64, 67, 0.3)",
        "elevation-5":
          "0 8px 12px 6px rgba(60, 64, 67, 0.15), 0 4px 4px 0 rgba(60, 64, 67, 0.3)",
        "focus-ring": "0 0 0 3px rgba(26, 115, 232, 0.2)",
      },

      // Large rounded corners for MD3
      borderRadius: {
        "md3-sm": "8px",
        "md3-md": "12px",
        "md3-lg": "16px",
        "md3-xl": "20px",
        "md3-2xl": "24px",
        "md3-3xl": "28px",
      },

      // 8dp grid spacing system
      spacing: {
        0.5: "4px",
        1: "8px",
        1.5: "12px",
        2: "16px",
        2.5: "20px",
        3: "24px",
        4: "32px",
        5: "40px",
        6: "48px",
        7: "56px",
        8: "64px",
        10: "80px",
        12: "96px",
        16: "128px",
        20: "160px",
      },

      // Material motion
      transitionDuration: {
        0: "0ms",
        fast: "150ms",
        normal: "200ms",
        slow: "300ms",
        slower: "400ms",
      },

      transitionTimingFunction: {
        "md3-standard": "cubic-bezier(0.2, 0, 0, 1)",
        "md3-emphasized": "cubic-bezier(0.2, 0, 0, 1)",
        "md3-decelerate": "cubic-bezier(0.05, 0.7, 0.1, 1)",
        "md3-accelerate": "cubic-bezier(0.3, 0, 0.8, 0.15)",
      },

      // Animations
      animation: {
        "fade-in": "fadeIn 200ms cubic-bezier(0.2, 0, 0, 1)",
        "fade-up": "fadeUp 250ms cubic-bezier(0.05, 0.7, 0.1, 1)",
        "scale-in": "scaleIn 200ms cubic-bezier(0.2, 0, 0, 1)",
        "slide-up": "slideUp 250ms cubic-bezier(0.05, 0.7, 0.1, 1)",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },

      // Content widths
      maxWidth: {
        "content-narrow": "600px",
        "content-default": "800px",
        "content-wide": "1100px",
        "content-full": "1400px",
      },

      // Font sizes following MD3 type scale
      fontSize: {
        "display-large": [
          "3.5rem",
          { lineHeight: "1.12", letterSpacing: "-0.02em" },
        ],
        "display-medium": [
          "2.75rem",
          { lineHeight: "1.16", letterSpacing: "-0.015em" },
        ],
        "display-small": [
          "2.25rem",
          { lineHeight: "1.22", letterSpacing: "-0.01em" },
        ],
        "headline-large": [
          "2rem",
          { lineHeight: "1.25", letterSpacing: "-0.005em" },
        ],
        "headline-medium": [
          "1.75rem",
          { lineHeight: "1.28", letterSpacing: "0" },
        ],
        "headline-small": [
          "1.5rem",
          { lineHeight: "1.33", letterSpacing: "0" },
        ],
        "title-large": ["1.375rem", { lineHeight: "1.27", letterSpacing: "0" }],
        "title-medium": [
          "1rem",
          { lineHeight: "1.5", letterSpacing: "0.01em" },
        ],
        "title-small": [
          "0.875rem",
          { lineHeight: "1.43", letterSpacing: "0.01em" },
        ],
        "body-large": ["1rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        "body-medium": [
          "0.875rem",
          { lineHeight: "1.43", letterSpacing: "0.015em" },
        ],
        "body-small": [
          "0.75rem",
          { lineHeight: "1.33", letterSpacing: "0.02em" },
        ],
        "label-large": [
          "0.875rem",
          { lineHeight: "1.43", letterSpacing: "0.01em" },
        ],
        "label-medium": [
          "0.75rem",
          { lineHeight: "1.33", letterSpacing: "0.02em" },
        ],
        "label-small": [
          "0.6875rem",
          { lineHeight: "1.45", letterSpacing: "0.02em" },
        ],
      },
    },
  },
  plugins: [],
};

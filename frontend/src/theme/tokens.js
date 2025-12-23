/**
 * Material Design 3 (Material You) Design Tokens
 * Centralized theme configuration for Google Store-like aesthetics
 *
 * This file defines all design tokens for consistent styling across the app.
 * Import and use these tokens in components instead of hardcoded values.
 */

// =============================================================================
// COLOR PALETTE
// =============================================================================

export const colors = {
  // Primary - Google Blue
  primary: {
    main: "#1a73e8",
    light: "#4285f4",
    dark: "#1557b0",
    container: "#d3e3fd",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#072b5f",
  },

  // Secondary - Tonal variations
  secondary: {
    main: "#5f6368",
    light: "#80868b",
    dark: "#3c4043",
    container: "#e8eaed",
    onSecondary: "#ffffff",
    onSecondaryContainer: "#1f1f1f",
  },

  // Surface colors (backgrounds)
  surface: {
    primary: "#ffffff",
    secondary: "#f8f9fa",
    tertiary: "#f1f3f4",
    elevated: "#ffffff",
    dim: "#e8eaed",
  },

  // Text colors
  text: {
    primary: "#202124",
    secondary: "#5f6368",
    tertiary: "#80868b",
    disabled: "#9aa0a6",
    inverse: "#ffffff",
    link: "#1a73e8",
  },

  // Semantic colors
  semantic: {
    success: "#1e8e3e",
    successContainer: "#e6f4ea",
    warning: "#f9ab00",
    warningContainer: "#fef7e0",
    error: "#d93025",
    errorContainer: "#fce8e6",
    info: "#1a73e8",
    infoContainer: "#e8f0fe",
  },

  // Border colors
  border: {
    default: "#dadce0",
    subtle: "#e8eaed",
    focus: "#1a73e8",
    hover: "#80868b",
  },

  // Overlay and scrim
  overlay: {
    scrim: "rgba(0, 0, 0, 0.32)",
    hover: "rgba(0, 0, 0, 0.04)",
    pressed: "rgba(0, 0, 0, 0.08)",
    focus: "rgba(0, 0, 0, 0.12)",
  },
};

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  // Font family
  fontFamily: {
    primary:
      '"Google Sans", "Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
    mono: '"Google Sans Mono", "Roboto Mono", monospace',
  },

  // Font weights (prefer 400-500, avoid 700+ except for emphasis)
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
  },

  // Type scale - Based on Material Design 3
  scale: {
    // Display - For hero text like "Go big. Or go bigger."
    displayLarge: {
      fontSize: "3.5rem", // 56px
      lineHeight: 1.12,
      letterSpacing: "-0.02em",
      fontWeight: 400,
    },
    displayMedium: {
      fontSize: "2.75rem", // 44px
      lineHeight: 1.16,
      letterSpacing: "-0.015em",
      fontWeight: 400,
    },
    displaySmall: {
      fontSize: "2.25rem", // 36px
      lineHeight: 1.22,
      letterSpacing: "-0.01em",
      fontWeight: 400,
    },

    // Headline - Section headings
    headlineLarge: {
      fontSize: "2rem", // 32px
      lineHeight: 1.25,
      letterSpacing: "-0.005em",
      fontWeight: 400,
    },
    headlineMedium: {
      fontSize: "1.75rem", // 28px
      lineHeight: 1.28,
      letterSpacing: "0",
      fontWeight: 400,
    },
    headlineSmall: {
      fontSize: "1.5rem", // 24px
      lineHeight: 1.33,
      letterSpacing: "0",
      fontWeight: 400,
    },

    // Title - Component headers
    titleLarge: {
      fontSize: "1.375rem", // 22px
      lineHeight: 1.27,
      letterSpacing: "0",
      fontWeight: 500,
    },
    titleMedium: {
      fontSize: "1rem", // 16px
      lineHeight: 1.5,
      letterSpacing: "0.01em",
      fontWeight: 500,
    },
    titleSmall: {
      fontSize: "0.875rem", // 14px
      lineHeight: 1.43,
      letterSpacing: "0.01em",
      fontWeight: 500,
    },

    // Body - Main content
    bodyLarge: {
      fontSize: "1rem", // 16px
      lineHeight: 1.5,
      letterSpacing: "0.01em",
      fontWeight: 400,
    },
    bodyMedium: {
      fontSize: "0.875rem", // 14px
      lineHeight: 1.43,
      letterSpacing: "0.015em",
      fontWeight: 400,
    },
    bodySmall: {
      fontSize: "0.75rem", // 12px
      lineHeight: 1.33,
      letterSpacing: "0.02em",
      fontWeight: 400,
    },

    // Label - Buttons and captions
    labelLarge: {
      fontSize: "0.875rem", // 14px
      lineHeight: 1.43,
      letterSpacing: "0.01em",
      fontWeight: 500,
    },
    labelMedium: {
      fontSize: "0.75rem", // 12px
      lineHeight: 1.33,
      letterSpacing: "0.02em",
      fontWeight: 500,
    },
    labelSmall: {
      fontSize: "0.6875rem", // 11px
      lineHeight: 1.45,
      letterSpacing: "0.02em",
      fontWeight: 500,
    },
  },
};

// =============================================================================
// SPACING (8dp Grid System)
// =============================================================================

export const spacing = {
  // Base unit: 8px
  0: "0",
  0.5: "4px", // 0.5 * 8
  1: "8px", // 1 * 8
  1.5: "12px", // 1.5 * 8
  2: "16px", // 2 * 8
  2.5: "20px", // 2.5 * 8
  3: "24px", // 3 * 8
  4: "32px", // 4 * 8
  5: "40px", // 5 * 8
  6: "48px", // 6 * 8
  7: "56px", // 7 * 8
  8: "64px", // 8 * 8
  10: "80px", // 10 * 8
  12: "96px", // 12 * 8
  16: "128px", // 16 * 8
  20: "160px", // 20 * 8
  24: "192px", // 24 * 8
};

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const borderRadius = {
  none: "0",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "28px",
  full: "9999px",
};

// =============================================================================
// ELEVATION / SHADOWS
// =============================================================================

export const elevation = {
  // Material Design 3 elevation levels
  0: "none",
  1: "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",
  2: "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15)",
  3: "0 4px 8px 3px rgba(60, 64, 67, 0.15), 0 1px 3px 0 rgba(60, 64, 67, 0.3)",
  4: "0 6px 10px 4px rgba(60, 64, 67, 0.15), 0 2px 3px 0 rgba(60, 64, 67, 0.3)",
  5: "0 8px 12px 6px rgba(60, 64, 67, 0.15), 0 4px 4px 0 rgba(60, 64, 67, 0.3)",

  // Interactive states
  hover:
    "0 4px 8px 3px rgba(60, 64, 67, 0.15), 0 1px 3px 0 rgba(60, 64, 67, 0.3)",
  active:
    "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)",

  // Focus ring
  focus: "0 0 0 3px rgba(26, 115, 232, 0.2)",
};

// =============================================================================
// MOTION / TRANSITIONS
// =============================================================================

export const motion = {
  // Durations (Material recommends 200-300ms for most transitions)
  duration: {
    instant: "0ms",
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "400ms",
  },

  // Easing curves
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    emphasized: "cubic-bezier(0.2, 0, 0, 1)",
    emphasizedDecelerate: "cubic-bezier(0.05, 0.7, 0.1, 1)",
    emphasizedAccelerate: "cubic-bezier(0.3, 0, 0.8, 0.15)",
  },
};

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1440px",
};

// =============================================================================
// Z-INDEX
// =============================================================================

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070,
};

// =============================================================================
// CONTENT WIDTH
// =============================================================================

export const contentWidth = {
  narrow: "600px",
  default: "800px",
  wide: "1100px",
  full: "1400px",
};

// =============================================================================
// HELPER: CSS VARIABLE EXPORT
// =============================================================================

export const getCSSVariables = () => ({
  // Colors
  "--color-primary": colors.primary.main,
  "--color-primary-light": colors.primary.light,
  "--color-primary-dark": colors.primary.dark,
  "--color-primary-container": colors.primary.container,

  "--color-surface-primary": colors.surface.primary,
  "--color-surface-secondary": colors.surface.secondary,
  "--color-surface-tertiary": colors.surface.tertiary,

  "--color-text-primary": colors.text.primary,
  "--color-text-secondary": colors.text.secondary,
  "--color-text-tertiary": colors.text.tertiary,

  "--color-border-default": colors.border.default,
  "--color-border-subtle": colors.border.subtle,

  // Typography
  "--font-family": typography.fontFamily.primary,
  "--font-weight-regular": typography.fontWeight.regular,
  "--font-weight-medium": typography.fontWeight.medium,

  // Spacing
  "--spacing-1": spacing[1],
  "--spacing-2": spacing[2],
  "--spacing-3": spacing[3],
  "--spacing-4": spacing[4],

  // Border radius
  "--radius-sm": borderRadius.sm,
  "--radius-md": borderRadius.md,
  "--radius-lg": borderRadius.lg,
  "--radius-xl": borderRadius.xl,
  "--radius-2xl": borderRadius["2xl"],
  "--radius-full": borderRadius.full,

  // Elevation
  "--elevation-1": elevation[1],
  "--elevation-2": elevation[2],
  "--elevation-3": elevation[3],
  "--elevation-hover": elevation.hover,

  // Motion
  "--duration-normal": motion.duration.normal,
  "--easing-standard": motion.easing.standard,
});

// Default export for convenient importing
const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  elevation,
  motion,
  breakpoints,
  zIndex,
  contentWidth,
  getCSSVariables,
};

export default theme;

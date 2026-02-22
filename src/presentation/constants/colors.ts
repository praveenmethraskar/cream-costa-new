/**
 * Centralized color constants for the application.
 * Carefully selected color palette for optimal dark/light theme support
 */
export const COLORS = {
  // Primary brand color - Ice cream themed blue
  PRIMARY: {
    LIGHT: "#2563eb", // blue-600
    DARK: "#3b82f6", // blue-500
    HOVER_LIGHT: "#1d4ed8", // blue-700
    HOVER_DARK: "#60a5fa", // blue-400
  },

  // Secondary/Accent color - Fresh mint/teal
  ACCENT: {
    LIGHT: "#14b8a6", // teal-500
    DARK: "#2dd4bf", // teal-400
    HOVER_LIGHT: "#0d9488", // teal-600
    HOVER_DARK: "#5eead4", // teal-300
  },

  // Success color - Green
  SUCCESS: {
    LIGHT: "#10b981", // emerald-500
    DARK: "#34d399", // emerald-400
  },

  // Warning color - Amber
  WARNING: {
    LIGHT: "#f59e0b", // amber-500
    DARK: "#fbbf24", // amber-400
  },

  // Error/Danger color - Red
  ERROR: {
    LIGHT: "#ef4444", // red-500
    DARK: "#f87171", // red-400
  },

  // Neutral colors - Grays
  NEUTRAL: {
    // Light theme neutrals
    BG_LIGHT: "#ffffff",
    SURFACE_LIGHT: "#f9fafb", // gray-50
    BORDER_LIGHT: "#e5e7eb", // gray-200
    TEXT_LIGHT: "#111827", // gray-900
    TEXT_SECONDARY_LIGHT: "#6b7280", // gray-500

    // Dark theme neutrals
    BG_DARK: "#111827", // gray-900
    SURFACE_DARK: "#1f2937", // gray-800
    BORDER_DARK: "#374151", // gray-700
    TEXT_DARK: "#f9fafb", // gray-50
    TEXT_SECONDARY_DARK: "#9ca3af", // gray-400
  },

  // Sidebar specific colors
  SIDEBAR: {
    BG_LIGHT: "#ffffff",
    BG_DARK: "#1f2937", // gray-800
    HOVER_LIGHT: "#f3f4f6", // gray-100
    HOVER_DARK: "#374151", // gray-700
    ACTIVE_BG_LIGHT: "#2563eb", // blue-600
    ACTIVE_BG_DARK: "#3b82f6", // blue-500
    TEXT_LIGHT: "#374151", // gray-700
    TEXT_DARK: "#e5e7eb", // gray-200
    ACTIVE_TEXT: "#ffffff",
  },

  // Order status colors
  ORDER_STATUS: {
    PENDING: "#f59e0b", // amber-500
    IN_PROGRESS: "#3b82f6", // blue-500
    COMPLETED: "#10b981", // emerald-500
    DISPATCHED: "#8b5cf6", // violet-500
  },

  // Card colors
  CARD: {
    BG_LIGHT: "#ffffff",
    BG_DARK: "#1f2937", // gray-800
    HOVER_BG_LIGHT: "#f9fafb", // gray-50
    HOVER_BG_DARK: "#374151", // gray-700
    BORDER_LIGHT: "#e5e7eb", // gray-200
    BORDER_DARK: "#374151", // gray-700
  },

  // Input colors
  INPUT: {
    BG_LIGHT: "#f9fafb", // gray-50
    BG_DARK: "#374151", // gray-700
    BORDER_LIGHT: "#d1d5db", // gray-300
    BORDER_DARK: "#4b5563", // gray-600
    FOCUS_BORDER_LIGHT: "#2563eb", // blue-600
    FOCUS_BORDER_DARK: "#3b82f6", // blue-500
  },

  // Utility classes for text (Tailwind)
  TEXT: {
    PRIMARY_LIGHT: "text-gray-900",
    PRIMARY_DARK: "dark:text-gray-50",
    SECONDARY_LIGHT: "text-gray-600",
    SECONDARY_DARK: "dark:text-gray-400",
    ERROR_LIGHT: "text-red-600",
    ERROR_DARK: "dark:text-red-400",
    SUCCESS_LIGHT: "text-emerald-600",
    SUCCESS_DARK: "dark:text-emerald-400",
    LINK_LIGHT: "text-blue-600",
    LINK_DARK: "dark:text-blue-400",
  },

  // Background utility classes
  BG: {
    PRIMARY_LIGHT: "bg-white",
    PRIMARY_DARK: "dark:bg-gray-900",
    SURFACE_LIGHT: "bg-gray-50",
    SURFACE_DARK: "dark:bg-gray-800",
    CARD_LIGHT: "bg-white",
    CARD_DARK: "dark:bg-gray-800",
  },

  // Border utility classes
  BORDER: {
    LIGHT: "border-gray-200",
    DARK: "dark:border-gray-700",
  },
} as const

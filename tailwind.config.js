/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#4F46E5",
        "brand-teal": "#0D9488",
        "off-white": "#F9FAFB",
        "deep-charcoal": "#111827",
        "soft-gray": "#6B7280",
        "accent": "#2563eb",
        "tldr-tint": "#f0f7ff",
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "full": "9999px"
      },
      boxShadow: {
        "soft": "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          branding: "#006B44", // Deep green from login button
          light: "#E2F2E9",    // Light mint background
          customer: "#FF6B00",
          farmer: "#059669",
          delivery: "#2563EB",
        },
        secondary: {
          yellow: "#F59E0B",
          red: "#EF4444",
        },
        background: "#F8FAFC",
        neutral: {
          900: "#1E293B",
          700: "#334155",
          500: "#64748B",
          400: "#94A3B8",
          100: "#F1F5F9",
        }
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },
      boxShadow: {
        card: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)",
        premium: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }
    },
  },
  plugins: [],
};

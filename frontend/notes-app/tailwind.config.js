/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      extend: {
        transitionTimingFunction: {
          "ease-in-out-custom": "cubic-bezier(0.68, -0.55, 0.27, 1.55)", // Custom easing function
        },
        boxShadow: {
          "shadow-default": "0 4px 6px rgba(0, 0, 0, 0.1)",
          "shadow-dark": "0 4px 6px rgba(0, 0, 0, 0.5)",
        },
      },
      colors: {
        primary: {
          default: "#F5F5F5 ",
          dark: "#1C252E",
          effects: "#ffffff",
        },
        secondary: {
          default: "#DDDDDD",
          dark: "#424B54",
          effects: "#ffffff",
        },
        accent: {
          default: "#007bff",
          dark: "#078DEE",
          effects: "#0351AB",
        },
        success: {
          default: "#28a745",
          dark: "#00AA73",
          effects: "#34ce57",
        },
        warning: {
          default: "#ffc107",
          dark: "#F1A42D",
          effects: "#ffd700",
        },
        critical: {
          default: "#dc3545",
          dark: "#FF4F4F",
          effects: "#FF7474",
        },
        info: {
          default: "#44A5FF",
          dark: "#0C66DC",
          effects: "#08BDFF",
        },
        background: {
          default: "#f2f3f4 ",
          dark: "#141A21",
          effects: "#ffffff",
        },
        shadow: {
          default: "#DDDDDD",
          dark: "#141A21",
          effects: "#000000",
        },
        text: {
          default: "#343a40",
          dark: "#ffffff",
          effects: "#000000",
        },
      },
    },
  },
  plugins: [],
};

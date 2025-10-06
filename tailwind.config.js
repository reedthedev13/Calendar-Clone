/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Events
        redEvent: "hsl(0, 75%, 60%)",
        redEventBg: "hsl(0, 75%, 95%)",
        redEventText: "hsl(0, 75%, 10%)",
        blueEvent: "hsl(200, 80%, 50%)",
        greenEvent: "hsl(150, 80%, 30%)",
        greenEventBg: "hsl(150, 80%, 95%)",
        greenEventText: "hsl(150, 80%, 10%)",

        // Calendar text / backgrounds
        todayTextBg: "hsl(200, 80%, 50%)",
        todayText: "#fff",
        weekText: "#777",
        modalHeader: "#555",
        modalLabel: "#777",

        // Buttons
        saveButtonBg: "hsl(150, 80%, 95%)",
        saveButtonText: "hsl(150, 80%, 10%)",
        deleteButtonBg: "hsl(0, 75%, 95%)",
        deleteButtonText: "hsl(0, 75%, 10%)",
      },
    },
  },
  plugins: [],
};

module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#0099cc",
        secondary: "#a7f086",
        accent: "#4338ca",
        base: "#fcfdfd",
        text: "#002633",
        info: "#3abff8",
        success: "#36d399",
        warning: "#fbbd23",
        danger: "#f87272",
        baseDark: "#22282a",
        textDark: "#d3dcde",
      },
      FontFamily: {
        sans: ["Inter"],
      },
    },
    plugins: [
      require("@tailwindcss/typography"),
      require("@tailwindcss/forms"),
      require("@tailwindcss/line-clamp"),
      require("@tailwindcss/aspect-ratio")
    ],
  },
};

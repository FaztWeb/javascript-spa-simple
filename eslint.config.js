const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: ["dist/**"],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
      sourceType: "module",
    },
  },
  {
    files: ["webpack/**/*.js", "eslint.config.js", "test/**/*.cjs"],
    languageOptions: {
      globals: globals.node,
      sourceType: "commonjs",
    },
  },
];

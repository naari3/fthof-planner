// eslint-disable-next-line @typescript-eslint/no-var-requires
const { readGitignoreFiles } = require("eslint-gitignore");
const gitignore = readGitignoreFiles({ cwd: __dirname });

module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:@next/next/recommended",
    "plugin:react/jsx-runtime",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "react"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
  globals: {
    React: "writable",
  },
  ignorePatterns: ["/originals/", ...gitignore],
  // ignorePatterns: [/* "/originals/", */...gitignore],
  overrides: [
    {
      files: ["**/*.tsx"],
      rules: {
        "react/prop-types": "off",
      },
    },
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
};

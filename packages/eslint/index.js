module.exports = {
  env: {
    node: true,
    browser: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "no-debugger": 2,
    "no-console": [2, { allow: ["warn", "error"] }],
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/ban-types": 0,
    "react/jsx-no-target-blank": 0,
    "react/no-unescaped-entities": 0,
    "react/display-name": 0,
    "react/prop-types": 0
  },
  settings: {
    react: {
      version: "detect"
    }
  }
}

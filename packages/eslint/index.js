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
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  plugins: ["@typescript-eslint", "prettier", "react"],
  settings: {
    react: {
      version: "detect"
    }
  },
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
    "node/no-missing-import": 0,
    "unicorn/no-array-reduce": 0
  }
}

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  // Base configuration for all files
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2020,
      },
    },
    rules: {
      // General rules
      "no-console": "warn",
      "no-debugger": "error",
      "no-unused-vars": "off", // Handled by TypeScript
      "prefer-const": "error",
      "no-var": "error",
      
      // Code style
      "indent": ["error", 2],
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      
      // Best practices
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      
      // Node.js specific
      "no-process-exit": "error",
      "no-path-concat": "error",
    },
  },
  
  // TypeScript specific configuration
  ...tseslint.configs.recommended,
  
  // Test files configuration
  {
    files: ["**/*.test.{ts,js}", "**/*.spec.{ts,js}", "**/__tests__/**/*"],
    rules: {
      "no-console": "off",
    },
  },
  
  // Configuration files
  {
    files: ["*.config.{js,ts,mjs}", "*.config.mts"],
    rules: {
      "no-console": "off",
    },
  },
];

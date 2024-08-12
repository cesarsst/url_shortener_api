// eslint.config.mjs
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["dist", "node_modules", "src/__tests__"], // Ignorar a pasta dist e node_modules
  },
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"], // Aplicar as regras para arquivos TypeScript
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json", // Caminho para o tsconfig.json
      },
      globals: {
        process: "readonly", // Adicionar 'process' como global
        __dirname: "readonly", // Se precisar, adicione mais globais aqui,
        console: "readonly", // Adicionar 'console' como global
        exports: "readonly", // Adicionar 'exports' como global
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
];

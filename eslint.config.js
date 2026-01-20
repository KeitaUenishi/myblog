import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import importPlugin from "eslint-plugin-import";
// import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
// import tailwindcss from "eslint-plugin-tailwindcss";
import unusedImports from "eslint-plugin-unused-imports";
import typescriptEslint from "typescript-eslint";

export default [
  {
    ignores: [
      ".astro/**",
      "dist/**",
      "node_modules/**",
      "src/content/blog/**",
      "src/scripts/**",
    ],
  },
  // add more generic rule sets here, such as:
  js.configs.recommended,
  // jsxA11yPlugin.configs.recommended,
  ...typescriptEslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    plugins: {
      "unused-imports": unusedImports,
      import: importPlugin,
    },
    rules: {
      "unused-imports/no-unused-imports": "error", // 未使用の import をエラーにする
      // _ で始まる変数は未使用でもエラーにしない （https://typescript-eslint.io/rules/no-unused-vars/#benefits-over-typescript）
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // import の順序を設定する
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "object",
            "type",
          ],
          "newlines-between": "always",
          pathGroupsExcludedImportTypes: ["builtin"],
          pathGroups: [
            {
              pattern: "@/components/**",
              group: "internal",
              position: "before",
            },
          ],
          alphabetize: {
            order: "asc",
          },
        },
      ],
      // ...tailwindcss.configs.recommended.rules,
    },
  },
  eslintConfigPrettier,
];

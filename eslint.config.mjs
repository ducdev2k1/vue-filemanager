import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import vuetify from 'eslint-plugin-vuetify';
import globals from 'globals';
import { createRequire } from 'node:module';
import tseslint from 'typescript-eslint';
const require = createRequire(import.meta.url);
const AutoImportJson = require('./.eslintrc-auto-import.json');

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{mjs,cjs,ts,vue}'] },
  { languageOptions: { globals: { ...globals.browser, ...AutoImportJson.globals } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...vuetify.configs['flat/recommended'],
  { files: ['**/*.vue'], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  {
    // https://eslint.org/docs/latest/use/configure/ignore
    ignores: [
      // only ignore node_modules in the same directory
      // as the configuration file
      'node_modules',
      // so you have to add `**/` pattern to include nested directories
      // for example, if you use pnpm workspace
      '**/node_modules',
      'src/**.d.ts',
    ],
  },
  {
    rules: {
      'vue/no-v-html': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/multi-word-component-names': 'off',
      'vuetify/no-deprecated-colors': 'off', // tắt cảnh báo màu sắc cũ của Vuetify
      'vuetify/no-deprecated-classes': 'off', // tắt cảnh báo class cũ của Vuetify
    },
  },
];

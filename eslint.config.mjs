import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import roqn from './eslint-rules/index.mjs';

export default tseslint.config(
  {
    ignores: ['dist/**', 'storybook-static/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { roqn },
    rules: {
      'roqn/no-raw-interactive-elements': 'error',
      'roqn/no-hardcoded-color': 'error',
      'roqn/require-eslint-disable-justification': 'error',
      'roqn/no-conflicting-accessible-name': 'error',
      'roqn/no-placeholder-as-label': 'error',
    },
  }
);

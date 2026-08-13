import cypress from 'eslint-plugin-cypress';
import mocha from 'eslint-plugin-mocha';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['node_modules/', 'cypress/downloads/', 'cypress/screenshots/', 'cypress/videos/'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['cypress/**/*.ts'],
    plugins: {
      cypress,
      mocha,
    },
    rules: {
      ...cypress.configs.recommended.rules,
      'cypress/no-unnecessary-waiting': 'error',
      'mocha/no-exclusive-tests': 'error',
    },
  },
  {
    files: ['cypress/support/commands.ts'],
    rules: {
      '@typescript-eslint/no-namespace': 'off',
    },
  },
);

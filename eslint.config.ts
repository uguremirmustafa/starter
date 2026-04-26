import js from '@eslint/js';
import tseslint, { ConfigArray } from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

const config: ConfigArray = [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: new URL('.', import.meta.url).pathname,
      },
    },
  },
  prettier,
  {
    ignores: ['dist/**', 'src/generated/**', 'jest.config.js'],
  },
];
export default config;

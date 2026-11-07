import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['**/dist/**']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
    plugins: {
      'jsx-bindings': {
        rules: {
          'used-components': {
            create(context) {
              return {
                JSXOpeningElement(node) {
                  let name = node.name;
                  while (name.type === 'JSXMemberExpression') name = name.object;
                  if (name.type === 'JSXIdentifier' && /^[A-Z]/.test(name.name)) {
                    context.sourceCode.markVariableAsUsed(name.name, node);
                  }
                },
              };
            },
          },
        },
      },
    },
  },
  { files: ['**/*.jsx'], rules: { 'jsx-bindings/used-components': 'error' } },
])

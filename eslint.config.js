import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import * as mdx from 'eslint-plugin-mdx';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Base configurations
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // MDX flat configuration
  {
    ...mdx.flat,
    // Enable linting of code blocks within MDX
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: true,
      languageMapper: {},
    }),
  },

  // MDX code blocks configuration
  {
    ...mdx.flatCodeBlocks,
    rules: {
      ...mdx.flatCodeBlocks.rules,
      // Code quality rules for code blocks
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },

  // Additional configuration for MDX files
  {
    files: ['**/*.mdx'],
    ignores: ['README.md'], // README.md is regular markdown, not MDX
    rules: {
      // MDX imports are often used in content and may not be detected by parser
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      // MDX content can have React components without explicit imports
      'react/jsx-no-undef': 'off',
      'react/no-unescaped-entities': 'off',
      // Code blocks in MDX may have variables that appear unused
      'no-undef': 'off',
      // Enforce alias usage: disallow any relative (./ or ../) imports inside MDX files
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./*', '../*', '../**', '../../*', '../../**', '../../../*', '../../../**'],
              message: 'Use alias imports (e.g. @/components/...) inside MDX instead of relative paths.'
            }
          ]
        }
      ],
    },
  },

  // Global settings
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Main configuration for TypeScript/React files
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    rules: {
      // React rules
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      
      // React Hooks rules
      ...reactHooks.configs.recommended.rules,
      
      // JSX A11y rules
      ...jsxA11y.configs.recommended.rules,
      

      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // React specific rules
      'react/prop-types': 'off', // We use TypeScript for prop validation
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+ JSX transform
      'react/jsx-uses-react': 'off', // Not needed with React 17+ JSX transform
      'react/jsx-no-target-blank': ['error', { allowReferrer: false }],
      'react/jsx-key': 'error',
      'react/no-array-index-key': 'warn',
      'react/no-unescaped-entities': 'error',

      // Import rules
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-unresolved': 'off', // TypeScript handles this
      'import/no-duplicates': 'error',
      // Enforce path alias usage instead of long relative traversals for src internals
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../components/*', '../../../components/*', '../..*/components/*'],
              message: 'Use @/components/... alias instead of deep relative path.'
            },
            {
              group: ['../../utils/*', '../../../utils/*', '../..*/utils/*'],
              message: 'Use @/utils/... alias instead of deep relative path.'
            },
            {
              group: ['../../config', '../../../config', '../..*/config'],
              message: 'Use @/config alias instead of deep relative path.'
            },
            {
              group: ['../types', '../../types', '../../../types'],
              message: 'Do not create or import root-level type files; consolidate under src/types and use @/types.'
            }
          ]
        }
      ],

      // General code quality rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],

      // Accessibility rules (relaxed for documentation site)
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['to'],
        },
      ],
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/heading-has-content': 'warn', // Relaxed for MDX components
    },
  },

  // Configuration for MDX wrapper components
  {
    files: ['**/MDXWrapper.tsx'],
    rules: {
      'jsx-a11y/heading-has-content': 'off', // MDX headings are dynamic
      '@typescript-eslint/no-explicit-any': 'off', // MDX props are inherently any
    },
  },

  // Configuration for build/tooling files
  {
  files: ['src/tools/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off', // Allow console in build scripts
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  // Allow console in codemod scripts
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off'
    }
  },

  // Configuration for config files
  {
    files: [
      '*.config.js',
      '*.config.ts',
      'vite.config.ts',
      'tailwind.config.js',
      'postcss.config.js',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'import/no-default-export': 'off',
    },
  },

  // Global ignores
  {
    ignores: [
      'examples/**',
      'dist/**',
      'node_modules/**',
      '.vite/**',
      'src/generated-*.ts',
      'src/generated-*.tsx',
  'src/public/**',
      '*.min.js',
      'coverage/**',
      'README.md', // Regular markdown, not MDX
      // Note: MDX files are now linted with mdx plugin
    ],
  }
);
import path from 'path';

import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import { defineConfig, loadEnv } from 'vite';

// Import the JS module (has accompanying d.ts)
// @ts-expect-error ESM JS module with provided d.ts
import { resolveBasePath } from './scripts/resolve-base-path.mjs';

export default defineConfig(({ mode, command: _command }) => {
    const env = loadEnv(mode, '.', '');

    // Single source of truth now – uses VITE_FORCE_BASE / VITE_BASE_PATH / git detection.
    const basePath = resolveBasePath();

    return {
      base: basePath,
      plugins: [
        mdx({
          remarkPlugins: [remarkGfm, remarkFrontmatter],
          providerImportSource: '@mdx-js/react'
        })
      ],
      build: {
        target: 'es2018',
        cssCodeSplit: true,
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              if (id.includes('node_modules')) {
                if (id.includes('react')) {
                  return 'vendor';
                }
                if (id.includes('prism')) {
                  return 'prism';
                }
                if (id.includes('mdx')) {
                  return 'mdx';
                }
                return 'vendor';
              }
            },
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]'
          },
        },
        minify: 'esbuild',
        sourcemap: false,
        reportCompressedSize: false,
        chunkSizeWarningLimit: 1000
      },
      esbuild: {
        drop: mode === 'production' ? ['console', 'debugger'] : [],
      },
      css: {
        postcss: './postcss.config.js',
        devSourcemap: false
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Performance optimizations
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', '@mdx-js/react'],
        exclude: []
      },
      // SSG specific configuration
      ssgOptions: {
        script: 'async',
        dirStyle: 'nested',
        includeAllRoutes: true,
        format: 'esm'
      },
    };
});
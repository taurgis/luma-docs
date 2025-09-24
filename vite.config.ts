import path from 'path';

import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import { defineConfig, type UserConfig } from 'vite';

// Import the JS module (has accompanying d.ts)
// @ts-expect-error ESM JS module with provided d.ts
import { resolveBasePath } from './src/tools/resolve-base-path.mjs';

export default defineConfig(({ mode, command: _command }) => {
    // During Vitest runs we dramatically simplify the config to avoid
    // invoking git/base path resolution & heavy SSG plugin semantics that
    // are unnecessary for unit tests (and recently caused a startup crash
    // after content/ path migration).
    if (process.env.VITEST) {
      const minimal: UserConfig = {
        plugins: [react()],
        resolve: {
          alias: {
            '@/config': path.resolve(__dirname, 'config.ts'),
            '@': path.resolve(__dirname, 'src')
          }
        }
      };
      return minimal;
    }

    // Single source of truth now – uses VITE_FORCE_BASE / VITE_BASE_PATH / git detection.
    const basePath = resolveBasePath();

    return {
      base: basePath,
      // Use moved static assets directory (previously project-root /public)
      publicDir: 'src/public',
      plugins: [
        react(),
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
      define: {},
      resolve: {
        alias: {
          '@/config': path.resolve(__dirname, 'config.ts'),
          // Constrain @ alias to application source (avoid accidentally importing build scripts)
          '@': path.resolve(__dirname, 'src'),
          '@tools': path.resolve(__dirname, 'src/tools'),
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
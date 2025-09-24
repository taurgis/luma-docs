import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Type interoperability workaround: vitest pulls its own nested vite version creating incompatible structural types.
export default defineConfig({
  // @ts-expect-error suppress plugin type mismatch due to duplicate vite type versions
  plugins: [react()],
  resolve: {
    alias: {
      '@/config': path.resolve(__dirname, 'config.ts'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.spec.{ts,tsx}'],
    coverage: { provider: 'v8', reporter: ['text', 'lcov'] }
  }
});

/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/__tests__/**',
        'drizzle/',
        '.next/',
        'coverage/',
        'out/',
        'scripts/',
        'server.ts',
        'next.config.ts',
        'postcss.config.mjs',
        'tailwind.config.*',
        'eslint.config.mjs',
        'vitest.config.ts',
        'tsconfig.json',
        'components.json',
        '**/*.config.*',
        '**/middleware.ts',
        '**/setup.ts',
        '**/types/**',
        '**/styles/**',
        '**/public/**',
        '**/app/favicon.ico',
        '**/app/globals.css',
        '**/app/layout.tsx',
        '**/app/page.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});

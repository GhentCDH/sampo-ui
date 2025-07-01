import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import express from 'express';

const configureConfigs = () => ({
  name: 'configure-server',
  configureServer(server) {
    server.middlewares.use('/configs/', express.static(path.resolve(__dirname, '../configs/')));
  }
})

export default defineConfig({
  plugins: [react(), configureConfigs()],
  esbuild: {
    loader: 'jsx',
    include: [/\.js$/, /\.jsx$/], // Handle both .js and .jsx files
    exclude: [/node_modules\/.*/]
  },
  server: {
    port: 8080,
    host: true,
    fs: {
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      '/configs/': path.resolve(__dirname, '../configs/'),
    }
  },
  define: {
    'process.env.API_URL': JSON.stringify(process.env.API_URL || ''),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
});
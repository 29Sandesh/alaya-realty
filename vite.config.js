import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 7999,
    host: true,
    open: false
  },
  preview: {
    port: 7999
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        properties: resolve(__dirname, 'properties.html'),
        vedaPark: resolve(__dirname, 'veda-park.html'),
        advisory: resolve(__dirname, 'advisory.html'),
        insights: resolve(__dirname, 'insights.html'),
        articleIndustrial: resolve(__dirname, 'article-industrial.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html')
      }
    }
  }
});

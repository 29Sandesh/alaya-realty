import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Clean URLs Plugin for Vite dev server:
 * Maps extensionless routes like /veda-park to /veda-park.html
 */
function cleanUrlsPlugin() {
  return {
    name: 'clean-urls-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url) {
          const [pathname, search] = req.url.split('?');
          const queryString = search ? `?${search}` : '';

          // Skip assets, node_modules, API, or URLs with existing file extensions
          if (!pathname.includes('.') && pathname !== '/') {
            const knownPages = [
              '/veda-park',
              '/properties',
              '/advisory',
              '/insights',
              '/about',
              '/contact',
              '/article-industrial'
            ];

            const match = knownPages.find(page => pathname === page || pathname === `${page}/`);
            if (match) {
              req.url = `${match.replace(/\/$/, '')}.html${queryString}`;
            }
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [cleanUrlsPlugin()],
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

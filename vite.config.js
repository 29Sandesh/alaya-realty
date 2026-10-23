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
            const routeMap = {
              '/veda-park': '/veda-park.html',
              '/projects/veda-park': '/veda-park.html',
              '/veda-commune': '/veda-commune.html',
              '/projects/veda-commune': '/veda-commune.html',
              '/urban-shivashish': '/urban-shivashish.html',
              '/projects/urban-shivashish': '/urban-shivashish.html',
              '/properties': '/properties.html',
              '/advisory': '/advisory.html',
              '/insights': '/insights.html',
              '/about': '/about.html',
              '/contact': '/contact.html',
              '/article-industrial': '/article-industrial.html'
            };

            const cleanPath = pathname.replace(/\/$/, '');
            if (routeMap[cleanPath]) {
              req.url = `${routeMap[cleanPath]}${queryString}`;
            }
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  root: resolve(__dirname),
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
        vedaCommune: resolve(__dirname, 'veda-commune.html'),
        urbanShivashish: resolve(__dirname, 'urban-shivashish.html'),
        advisory: resolve(__dirname, 'advisory.html'),
        insights: resolve(__dirname, 'insights.html'),
        articleIndustrial: resolve(__dirname, 'article-industrial.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html')
      }
    }
  }
});

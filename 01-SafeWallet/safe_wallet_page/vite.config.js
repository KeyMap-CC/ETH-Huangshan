import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://cellservice.live',
        changeOrigin: true,
        timeout: 60000, // 1 minute timeout (60000ms)
        configure: (proxy, _options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Extract token from Set-Cookie header and add it to a custom header
            const cookies = proxyRes.headers['set-cookie'];
            if (cookies && Array.isArray(cookies)) {
              for (const cookie of cookies) {
                if (cookie.includes('satoken=')) {
                  const match = cookie.match(/satoken=([^;]+)/);
                  if (match && match[1]) {
                    // Add the token to a custom header that the client can access
                    proxyRes.headers['x-extracted-token'] = match[1];
                    console.log('Token extracted and added to x-extracted-token header');
                    break;
                  }
                }
              }
            }
          });
        }
      }
    }
  }
});

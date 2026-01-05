import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        historyApiFallback: true,
      },
      plugins: [
        react(),
        // Configure CORS
        () => ({
          name: 'configure-response-handling',
          configureServer(server) {
            server.middlewares.use((req, res, next) => {
              res.setHeader('Access-Control-Allow-Origin', '*');
              next();
            });
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'recharts']
      }
    };
});
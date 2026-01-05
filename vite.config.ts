import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // 为GitHub Pages添加base配置
      base: mode === 'production' ? './' : '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
        historyApiFallback: true,
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
        manifest: true,
        minify: 'esbuild',
        sourcemap: false,
        // 使用标准的Rollup输出配置
        rollupOptions: {
          output: {
            manualChunks: {
              react: ['react', 'react-dom', 'react-router-dom'],
              recharts: ['recharts'],
              lucide: ['lucide-react']
            }
          }
        }
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
        },
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'recharts']
      }
    };
});
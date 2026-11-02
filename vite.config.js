import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { spawn } from 'child_process';
import net from 'net';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let backendProc = null;

function autoBackendPlugin() {
  return {
    name: 'auto-backend-server',
    configureServer(_server) {
      // Probe port 5001 to see if backend is already listening
      const socket = net.createConnection({ port: 5001, host: '127.0.0.1' });
      socket.setTimeout(400);

      socket.on('connect', () => {
        socket.destroy();
        console.log('\x1b[32m✔ Express Backend is already running on http://127.0.0.1:5001\x1b[0m');
      });

      socket.on('error', () => {
        socket.destroy();
        console.log('\x1b[36m🚀 Auto-starting backend server on http://127.0.0.1:5001...\x1b[0m');
        backendProc = spawn('node', [path.resolve(__dirname, 'server/index.js')], {
          stdio: 'inherit',
          cwd: __dirname,
          env: process.env
        });

        backendProc.on('error', (err) => {
          console.error('❌ Failed to spawn backend process:', err.message);
        });
      });

      const cleanup = () => {
        if (backendProc) {
          try {
            backendProc.kill('SIGTERM');
          } catch {}
          backendProc = null;
        }
      };

      process.on('exit', cleanup);
      process.on('SIGINT', cleanup);
      process.on('SIGTERM', cleanup);
    }
  };
}

export default defineConfig({
  plugins: [react(), autoBackendPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    open: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res) => {
            if (res && !res.headersSent && typeof res.writeHead === 'function') {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                data: null,
                error: {
                  message: 'جاري تشغيل خادم المكتبة، يرجى الانتظار لحظات...',
                  code: 'BACKEND_STARTING'
                }
              }));
            }
          });
        }
      }
    }
  }
});

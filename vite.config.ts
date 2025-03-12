import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || (
        mode === 'production'
          ? 'https://portal.bgruz.com' 
          : 'https://portal.bgruz.com'
      )),
      'import.meta.env.VITE_WS_BASE_URL': JSON.stringify(env.VITE_WS_BASE_URL || (
        mode === 'production'
          ? 'wss://portal.bgruz.com/ws' 
          : 'wss://portal.bgruz.com/ws'
      )),
    },
  };
});

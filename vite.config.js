import { sveltekit } from '@sveltejs/kit/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

/** @type {import('vite').UserConfig} */
const config = {
  optimizeDeps: {
    include: ['just-throttle', 'dayjs']
  },
  plugins: [basicSsl(), sveltekit()],
  server: {
    port: 5173,
    strictPort: false
  },
  preview: {
    port: 4173,
    strictPort: false
  }
};

export default config;

import { sveltekit } from '@sveltejs/kit/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

/** @type {import('vite').UserConfig} */
const config = {
  optimizeDeps: {
    include: ['just-throttle', 'dayjs']
  },
  plugins: [basicSsl(), sveltekit()]
};

export default config;

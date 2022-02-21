import 'dotenv/config';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    vite: {
      optimizeDeps: {
        include: ['just-throttle', 'dayjs']
      }
    }
  }
};

export default config;

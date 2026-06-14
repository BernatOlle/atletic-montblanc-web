import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://atletic-montblanc-web.vercel.app',
  integrations: [tailwind()],
});

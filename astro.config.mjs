import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://atleticmontblanc.cat',
  integrations: [tailwind()],
});

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://songlll.pages.dev',
  integrations: [sitemap()],
  // astro.config.mjs
});
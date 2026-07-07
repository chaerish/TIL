import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://chaerishtil.vercel.app',
  output: 'server',
  adapter: vercel(),
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
    },
  },
});

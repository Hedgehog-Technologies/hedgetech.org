import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Change `site` if you publish somewhere other than https://hedgetech.org.
// If deploying to a project URL (user.github.io/repo), also set `base: '/repo'`.
export default defineConfig({
  site: 'https://hedgetech.org',
  integrations: [sitemap()],
});

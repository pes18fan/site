import { defineConfig } from 'astro/config';

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: "monokai"
    }
  },
  integrations: [mdx()]
});
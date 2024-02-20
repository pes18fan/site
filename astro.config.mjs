import { readFileSync } from "fs"
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

import mdx from "@astrojs/mdx";

const kazeGrammar = JSON.parse(readFileSync("./public/assets/kaze.tmLanguage.json"));

// https://astro.build/config
export default defineConfig({
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    }
  }),
  markdown: {
    shikiConfig: {
      theme: "monokai",
      langs: [
        {
          id: "kaze",
          scopeName: "source.kaze",
          grammar: kazeGrammar,
          aliases: ["kaze"]
        }
      ]
    }
  },
  integrations: [mdx()],
  site: "https://p18f.vercel.app"
});

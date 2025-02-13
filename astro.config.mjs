import { readFileSync } from "fs";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import vercel from "@astrojs/vercel";

const kazeGrammar = JSON.parse(
    readFileSync("./public/assets/kaze.tmLanguage.json"),
);

// https://astro.build/config
export default defineConfig({
    markdown: {
        shikiConfig: {
            theme: "catppuccin-mocha",
            langs: [
                {
                    id: "kaze",
                    scopeName: "source.kaze",
                    grammar: kazeGrammar,
                    aliases: ["kaze"],
                },
                "javascript",
                "lua",
                "crystal",
            ],
        },
    },
    integrations: [mdx(), svelte()],
    site: "https://p18f.vercel.app",
    adapter: vercel(),
});


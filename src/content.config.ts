import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const postCollection = defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/posts" }),
    schema: z.object({
        title: z.string(),
        author: z.string().default("anon"),
        description: z.string(),
        image: z.object({
            url: z.string(),
            alt: z.string()
        }),
        pubDate: z.date()
    })
});

export const collections = {
    "posts": postCollection
}

import { z, defineCollection } from "astro:content";

const postCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        author: z.string().default("anon"),
        description: z.string(),
        image: z.object({
            url: z.string(),
            alt: z.string()
        }),
        pubDate: z.string()
    })
});

export const collections = {
    "posts": postCollection
}
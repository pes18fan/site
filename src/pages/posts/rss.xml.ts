import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import sanitizeHTML from "sanitize-html";
import { marked } from "marked";

export async function get(context: APIContext) {
    const posts = await getCollection("posts");
    return rss({
        title: "pes18fan's posts",
        description: "Posts about random stuff, I guess.",
        site: context.site!.toString(),
        items: posts.map(post => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            link: `/posts/${post.slug}`,
            content: sanitizeHTML(marked.parse(post.body))
        }))
    });
}

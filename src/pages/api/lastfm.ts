import type { APIRoute } from "astro";
import { RateLimiterMemory } from "rate-limiter-flexible";

export const prerender = false;

const rateLimiter = new RateLimiterMemory({
    points: 10,
    duration: 10,
})

export const GET: APIRoute = async ({ request }) => {
    try {
        const key = request.headers.get("x-forwarded-for") || request.headers.get("cf-connecting-ip");
        await rateLimiter.consume(key as string);
    } catch (err) {
        return new Response("Too many requests", { status: 429 });
    }
    
    const username = "***REMOVED***";
    const apiKey = import.meta.env.LASTFM_API_KEY;
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${username}&api_key=${apiKey}&format=json`;

    const response = await fetch(url);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
        headers: {
            "content-type": "application/json",
        },
    });
};

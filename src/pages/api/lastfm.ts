import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async () => {
    const username = "vezei";
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

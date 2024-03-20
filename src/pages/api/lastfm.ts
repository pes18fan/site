import type { APIRoute } from "astro";

export const prerender = false;

const cache = {
    artist: "starting...",
    track: "beep boop",
    playing: true,
};
let cachedDate: ReturnType<typeof Date.now> = 0;

const username = "vezei";
const apiKey = import.meta.env.LASTFM_API_KEY;

const url = new URL("https://ws.audioscrobbler.com/2.0");
url.searchParams.set("method", "user.getRecentTracks");
url.searchParams.set("user", username);
url.searchParams.set("api_key", apiKey);
url.searchParams.set("format", "json");
url.searchParams.set("limit", "1");

export const GET: APIRoute = async () => {
    if (Date.now() - cachedDate > 1000 * 60) {
        await updateCache();
    }

    return new Response(JSON.stringify(cache), {
        headers: {
            "content-type": "application/json",
        },
    });
};

async function updateCache() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        const track = data.recenttracks.track[0];
        cache.artist = track.artist["#text"];
        cache.track = track.name;
        cache.playing = track["@attr"]?.nowplaying === "true";

        cachedDate = Date.now();
    } catch(err) {
        console.error(err);
    }
}

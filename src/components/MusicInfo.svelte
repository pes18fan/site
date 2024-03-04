<script>
const username = "vezei";
const apiKey = import.meta.env.PUBLIC_LASTFM_API_KEY;

const url = `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${username}&api_key=${apiKey}&format=json`;

async function getTrack() {
    const res = await fetch(url);
    const data = await res.json();

    const nowPlayingTrack = data.recenttracks.track.find(
        (track) => track["@attr"] && track["@attr"].nowplaying
    );
    const lastPlayedTrack = data.recenttracks.track[0];

    return {
        nowPlayingTrack,
        lastPlayedTrack,
    };
}
</script>

{#await getTrack() then value}
{#if value.nowPlayingTrack}
    <p>
        <strong>Now playing: </strong> {value.nowPlayingTrack.name} by {value.nowPlayingTrack.artist["#text"]}.
    </p>
{:else}
    <p>
        <strong>Last played: </strong> {value.lastPlayedTrack.name} by {value.lastPlayedTrack.artist["#text"]}.
    </p>
{/if}
{/await}

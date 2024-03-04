<script>
const url = "/api/lastfm";

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

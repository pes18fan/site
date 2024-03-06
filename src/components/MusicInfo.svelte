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

<div class="music-info">
{#await getTrack() then value}
{#if value.nowPlayingTrack}
    <p><b>Now playing</b></p>
    <p>{value.nowPlayingTrack.name}</p>
    <p>by {value.nowPlayingTrack.artist["#text"]}.</p>
{:else}
    <p><b>Last listened to</b></p>
    <p>{value.lastPlayedTrack.name}</p>
    <p>by {value.lastPlayedTrack.artist["#text"]}.</p>
{/if}
{/await}
</div>

<style>
    .music-info {
        flex: 1;
        text-align: right;
        margin-top: 0;
    } 

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    p {
        margin: 0;
        margin-bottom: 5px;

        /* for fade-in */
        opacity: 0;
        animation: fadeIn 1s ease-in forwards;
    }
</style>

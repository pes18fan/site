<script>
const url = "/api/lastfm";

async function getTrack() {
    const res = await fetch(url);
    return await res.json();
}
</script>

<div class="music-info">
{#await getTrack() then value}
{#if value.playing}
    <p><b>Listening to</b></p>
    <p>{value.track}</p>
    <p>by {value.artist}.</p>
{:else}
    <p><b>Last listened to</b></p>
    <p>{value.track}</p>
    <p>by {value.artist}.</p>
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

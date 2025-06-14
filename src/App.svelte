<script lang="ts">
  import FileUploader from "$lib/components/FileUploader.svelte";
  import Viewer from "$lib/components/Viewer.svelte";
  import AudioPlayer from "$lib/components/AudioPlayer.svelte"; // <-- Import player
  import { bookData } from "$lib/stores/book";
  import { audioUrl } from "$lib/stores/audio"; // <-- Import audio store
</script>

<main>
  <header>
    <h1>Elegant ePub Reader</h1>
  </header>

  {#if $bookData}
    <Viewer />
  {:else}
    <FileUploader />
  {/if}
</main>

<!-- This block will now render the player when an audio URL is available -->
{#if $audioUrl}
  <AudioPlayer />
{/if}

<style>
  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    margin: 0;
    background-color: #f8f8f8;
    /* Add padding to the bottom to prevent the player from overlapping content */
    padding-bottom: 80px;
  }

  main {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 1rem;
  }

  header {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }
</style>

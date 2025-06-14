<script lang="ts">
    import ePub, { type Book, type Rendition } from "epubjs";
    import { onMount } from "svelte";
    import { bookData } from "$lib/stores/book";
    import { audioUrl } from "$lib/stores/audio"; // <-- Import the new audio store

    let viewerEl: HTMLElement;
    let rendition: Rendition;
    let book: Book;

    onMount(() => {
        const unsub = bookData.subscribe(async (data) => {
            if (data) {
                book = ePub(data);

                // Wait for the book's resources to be loaded
                await book.ready;

                // --- NEW: Audio detection logic ---
                const audioResource = findAudioResource(book);
                if (audioResource) {
                    // Get the audio data as a Blob
                    const audioBlob = await audioResource.blob();
                    // Create a temporary URL for the browser to play
                    const objectUrl = URL.createObjectURL(audioBlob);
                    audioUrl.set(objectUrl); // <-- Set the URL in our store
                }
                // --- End of new logic ---

                rendition = book.renderTo(viewerEl, {
                    width: "100%",
                    height: "100%",
                    flow: "paginated",
                });
                rendition.display();
            }
        });

        return () => {
            unsub();
            // Clean up the object URL when the component is destroyed
            audioUrl.set(null);
            const currentUrl = $audioUrl;
            if (currentUrl) {
                URL.revokeObjectURL(currentUrl);
            }
        };
    });

    /**
     * Scans the book's manifest for the first supported audio file.
     */
    function findAudioResource(book: Book) {
        const supportedTypes = ["audio/mpeg", "audio/mp3", "audio/oembed"];
        // book.resources.all() gives us access to all files (images, css, audio, etc.)
        for (const href in book.resources.all()) {
            const resource = book.resources.get(href);
            if (resource && supportedTypes.includes(resource.mediaType)) {
                return resource; // Return the first one we find
            }
        }
        return null;
    }

    function next() {
        rendition?.next();
    }

    function prev() {
        rendition?.prev();
    }
</script>

<div class="viewer-container">
    <div class="controls">
        <button on:click={prev}>&larr; Previous</button>
        <button on:click={next}>Next &rarr;</button>
    </div>
    <div class="viewer" bind:this={viewerEl} />
</div>

<style>
    .viewer-container {
        width: 100%;
        height: 85vh; /* Adjusted height to make space for the player */
        display: flex;
        flex-direction: column;
    }
    .controls {
        text-align: center;
        padding: 0.5rem;
        flex-shrink: 0;
    }
    .viewer {
        flex-grow: 1;
        border: 1px solid #ccc;
        border-radius: 8px;
        overflow: hidden;
    }
</style>

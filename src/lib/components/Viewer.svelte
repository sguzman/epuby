<script lang="ts">
    import ePub, { type Book, type Rendition, type Resource } from "epubjs";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { bookData } from "$lib/stores/book";
    import { audioUrl } from "$lib/stores/audio";

    let viewerEl: HTMLElement;
    let rendition: Rendition;
    let book: Book;

    onMount(() => {
        const unsub = bookData.subscribe(async (data) => {
            if (data) {
                book = ePub(data);

                // Wait for the book's resources to be loaded
                await book.ready;

                // --- Audio detection logic ---
                const audioResource = findAudioResource(book);
                if (audioResource) {
                    // Get the audio data as a Blob
                    const audioBlob = await audioResource.blob();
                    // Create a temporary URL for the browser to play
                    const objectUrl = URL.createObjectURL(audioBlob);
                    audioUrl.set(objectUrl);
                }
                // --- End of audio logic ---

                rendition = book.renderTo(viewerEl, {
                    width: "100%",
                    height: "100%",
                    flow: "paginated",
                });
                rendition.display();
            }
        });

        // Cleanup logic for when the component is destroyed
        return () => {
            unsub();
            const currentUrl = get(audioUrl); // Get value from store safely
            if (currentUrl) {
                URL.revokeObjectURL(currentUrl);
                audioUrl.set(null);
            }
        };
    });

    /**
     * Scans the book's manifest for the first supported audio file.
     */
    function findAudioResource(book: Book): Resource | undefined {
        const supportedTypes = ["audio/mpeg", "audio/mp3", "audio/oembed"];
        // book.resources.all() gives us access to all files (images, css, audio, etc.)
        for (const href in book.resources.all()) {
            const resource = book.resources.get(href);
            if (resource && supportedTypes.includes(resource.mediaType)) {
                return resource; // Return the first one we find
            }
        }
        return undefined;
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
    <!-- FIX: Changed self-closing tag to a proper opening/closing tag -->
    <div class="viewer" bind:this={viewerEl}></div>
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

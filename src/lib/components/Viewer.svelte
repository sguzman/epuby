<script lang="ts">
    import ePub, { type Book, type Rendition, type Resource } from "epubjs";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { bookData } from "$lib/stores/book";
    import { audioUrl } from "$lib/stores/audio";
    import { addNotification } from "$lib/stores/notifications";

    let viewerEl: HTMLElement;
    let rendition: Rendition;
    let book: Book;

    // FIX: We use onMount to ensure viewerEl exists before we try to use it.
    onMount(() => {
        const currentBookData = get(bookData);
        if (!currentBookData) return;

        book = ePub(currentBookData);

        // The book.renderTo call now happens safely inside onMount
        rendition = book.renderTo(viewerEl, {
            width: "100%",
            height: "100%",
            flow: "paginated",
        });
        rendition.display();

        // Check for audio after the book is fully parsed
        book.ready.then(() => {
            const audioResource = findAudioResource(book);
            if (audioResource) {
                addNotification("Audio file found in ePub!", "success");
                audioResource.blob().then((audioBlob) => {
                    const objectUrl = URL.createObjectURL(audioBlob);
                    audioUrl.set(objectUrl);
                });
            } else {
                addNotification("No audio file found in this ePub.", "failure");
            }
        });

        // Cleanup logic for when the component is destroyed
        return () => {
            const currentUrl = get(audioUrl);
            if (currentUrl) {
                URL.revokeObjectURL(currentUrl);
                audioUrl.set(null);
            }
            book?.destroy();
        };
    });

    function findAudioResource(book: Book): Resource | undefined {
        const supportedTypes = ["audio/mpeg", "audio/mp3", "audio/oembed"];
        for (const href in book.resources.all()) {
            const resource = book.resources.get(href);
            if (resource && supportedTypes.includes(resource.mediaType)) {
                return resource;
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
    <div class="viewer" bind:this={viewerEl}></div>
</div>

<style>
    .viewer-container {
        width: 100%;
        height: 85vh;
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

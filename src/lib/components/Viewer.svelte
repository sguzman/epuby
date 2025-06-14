<script lang="ts">
    import ePub, { type Book, type Rendition } from "epubjs";
    import { onMount } from "svelte";
    import { bookData } from "$lib/stores/book";

    let viewerEl: HTMLElement;
    let rendition: Rendition;
    let book: Book;

    onMount(() => {
        // The bookData store contains the ArrayBuffer of the uploaded .epub file
        const unsub = bookData.subscribe((data) => {
            if (data) {
                book = ePub(data);
                rendition = book.renderTo(viewerEl, {
                    width: "100%",
                    height: "100%",
                    flow: "paginated", // or "scrolled-doc"
                });
                rendition.display();
            }
        });

        return () => unsub(); // Cleanup subscription on component destroy
    });

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
        height: 90vh;
        display: flex;
        flex-direction: column;
    }
    .controls {
        text-align: center;
        padding: 0.5rem;
    }
    .viewer {
        flex-grow: 1;
        border: 1px solid #ccc;
    }
</style>

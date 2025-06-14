<script lang="ts">
    import { bookData } from "$lib/stores/book";

    let loading = false;

    function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) {
            return;
        }

        // Check for the .epub extension
        if (!file.name.toLowerCase().endsWith(".epub")) {
            alert("Please select a valid .epub file.");
            return;
        }

        loading = true;
        const reader = new FileReader();

        reader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            // When the file is loaded, update our store with its data
            bookData.set(arrayBuffer);
            loading = false;
        };

        reader.onerror = () => {
            loading = false;
            alert("There was an error reading the file.");
        };

        reader.readAsArrayBuffer(file);
    }
</script>

<div class="uploader-wrapper">
    {#if loading}
        <p>Loading book...</p>
    {:else}
        <h2>Upload an ePub File</h2>
        <label for="book-upload">
            Select a book from your device to begin reading.
        </label>
        <input
            type="file"
            id="book-upload"
            accept=".epub"
            on:change={handleFileSelect}
        />
    {/if}
</div>

<style>
    .uploader-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 2rem;
        border: 2px dashed #ccc;
        border-radius: 8px;
        max-width: 500px;
        margin: 2rem auto;
    }
    h2 {
        margin-top: 0;
    }
    label {
        margin-bottom: 1rem;
        color: #555;
    }
</style>

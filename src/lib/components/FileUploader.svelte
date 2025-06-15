<script lang="ts">
    import { bookData } from "$lib/stores/book";
    import { addNotification } from "$lib/stores/notifications";

    let loading = false;

    function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.name.toLowerCase().endsWith(".epub")) {
            addNotification(
                "Invalid file type. Please select a .epub file.",
                "failure",
            );
            return;
        }

        loading = true;
        const reader = new FileReader();

        reader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            addNotification(`Successfully loaded "${file.name}"`, "success");
            bookData.set(arrayBuffer);
            loading = false;
        };

        reader.onerror = () => {
            loading = false;
            addNotification(`Error reading file: "${file.name}"`, "failure");
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

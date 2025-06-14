<script lang="ts">
    import { audioUrl } from "$lib/stores/audio";
    import { onMount } from "svelte";

    // Component State
    let audioElement: HTMLAudioElement;
    let isPlaying = false;
    let currentTime = 0;
    let duration = 0;
    let playbackRate = 1;
    let skipIncrement = 10; // Default skip time in seconds

    // Reactive bindings
    $: if (audioElement && $audioUrl) {
        audioElement.src = $audioUrl;
    }
    $: if (audioElement) {
        audioElement.playbackRate = playbackRate;
    }

    function togglePlay() {
        if (isPlaying) {
            audioElement.pause();
        } else {
            audioElement.play();
        }
    }

    function seek(direction: "forward" | "backward") {
        if (!audioElement) return;
        let newTime = 0;
        if (direction === "forward") {
            newTime = Math.min(duration, currentTime + skipIncrement);
        } else {
            newTime = Math.max(0, currentTime - skipIncrement);
        }
        audioElement.currentTime = newTime;
    }

    function formatTime(seconds: number): string {
        if (isNaN(seconds) || seconds === 0) return "00:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    }
</script>

<!-- The HTML audio element is hidden, we control it via our custom UI -->
<audio
    bind:this={audioElement}
    bind:isPlaying
    bind:currentTime
    bind:duration
    on:canplay={() => audioElement.play()}
/>

<div class="player-bar">
    <!-- Play/Pause Button -->
    <button class="control-btn play-pause" on:click={togglePlay}>
        {isPlaying ? "❚❚" : "►"}
    </button>

    <!-- Scrubber/Seek Bar -->
    <div class="scrubber">
        <span>{formatTime(currentTime)}</span>
        <input
            type="range"
            class="progress-bar"
            min="0"
            max={duration || 1}
            bind:value={currentTime}
            on:input={() => (audioElement.currentTime = currentTime)}
        />
        <span>{formatTime(duration)}</span>
    </div>

    <!-- Skip Controls -->
    <div class="skip-controls">
        <button class="control-btn" on:click={() => seek("backward")}>
            «
        </button>
        <input type="number" bind:value={skipIncrement} min="1" />
        <button class="control-btn" on:click={() => seek("forward")}>
            »
        </button>
    </div>

    <!-- Speed Controls -->
    <div class="speed-controls">
        <label for="speed">Speed:</label>
        <select id="speed" bind:value={playbackRate}>
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
        </select>
    </div>
</div>

<style>
    .player-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 0.75rem 1.5rem;
        background-color: #fff;
        border-top: 1px solid #e0e0e0;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
        font-family: sans-serif;
    }
    .control-btn {
        background: none;
        border: 1px solid #ccc;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
    }
    .control-btn:hover {
        background-color: #f0f0f0;
    }
    .play-pause {
        font-size: 1.5rem;
        line-height: 1;
    }
    .scrubber {
        flex-grow: 1;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    .progress-bar {
        width: 100%;
        cursor: pointer;
    }
    .skip-controls,
    .speed-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .skip-controls input {
        width: 50px;
        text-align: center;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 0.3rem;
    }
</style>

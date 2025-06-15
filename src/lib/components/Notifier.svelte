<script lang="ts">
    import { notifications } from "$lib/stores/notifications";
    import { slide } from "svelte/transition";
</script>

<div class="notifier-wrapper">
    {#each $notifications as notification (notification.id)}
        <div
            class="notification {notification.type}"
            transition:slide={{ duration: 300 }}
        >
            <p>{notification.message}</p>
        </div>
    {/each}
</div>

<style>
    .notifier-wrapper {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .notification {
        min-width: 250px;
        padding: 1rem;
        border-radius: 8px;
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .notification.success {
        background-color: #28a745; /* Bright Green */
    }
    .notification.failure {
        background-color: #dc3545; /* Bright Red */
    }
    .notification p {
        margin: 0;
    }
</style>

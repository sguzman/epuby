import { writable } from 'svelte/store';

export interface Notification {
    id: number;
    type: 'success' | 'failure';
    message: string;
}

export const notifications = writable<Notification[]>([]);

export function addNotification(message: string, type: 'success' | 'failure') {
    const id = Date.now();
    notifications.update((all) => [{ id, type, message }, ...all]);

    // Automatically remove the notification after 5 seconds
    setTimeout(() => {
        notifications.update((all) => all.filter((n) => n.id !== id));
    }, 5000);
}
// src/lib/stores/book.ts
import { writable } from 'svelte/store';
import type { Book } from 'epubjs'; // Optional: for better type safety

export const bookData = writable<ArrayBuffer | null>(null);
export const bookInstance = writable<Book | null>(null);
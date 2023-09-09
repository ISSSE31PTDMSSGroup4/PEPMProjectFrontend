import { writable } from 'svelte/store';

export const currentUserId = writable(userId);

let userId = 0;
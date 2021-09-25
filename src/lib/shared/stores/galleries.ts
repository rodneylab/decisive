import { writable } from 'svelte/store';

const galleries = writable([]);

export { galleries as default };

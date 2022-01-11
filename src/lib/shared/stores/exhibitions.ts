import type { Exhibition } from '$lib/generated/graphql';
import { writable } from 'svelte/store';

const exhibitions = writable<Exhibition[]>([]);

export { exhibitions as default };

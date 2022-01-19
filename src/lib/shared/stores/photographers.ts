import type { Photographer } from '$lib/generated/graphql';
import { writable } from 'svelte/store';

const photographers = writable<Photographer[]>([]);

export { photographers as default };

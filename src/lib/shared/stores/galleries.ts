import type { Gallery } from '$lib/generated/graphql';

import { writable } from 'svelte/store';

const galleries = writable<Gallery[]>([]);

export { galleries as default };

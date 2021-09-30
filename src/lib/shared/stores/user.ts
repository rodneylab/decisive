import type { User } from '$lib/generated/graphql';
import { writable } from 'svelte/store';

const user = writable<User | null>(null);

export { user as default };

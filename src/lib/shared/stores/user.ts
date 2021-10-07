import type { User } from '$lib/generated/graphql';
import { writable } from 'svelte/store';

const user = writable<(User & { mfaAuthenticated?: boolean }) | null>(null);

export { user as default };

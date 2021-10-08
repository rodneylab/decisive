import type { TubeStation } from '$lib/generated/graphql';
import { writable } from 'svelte/store';

export const tubeStations = writable<TubeStation[]>([]);

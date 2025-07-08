import { writable } from 'svelte/store';

const loadingStore = () => {
	const { subscribe, set } = writable<boolean>(false);

	return {
		subscribe,
		start: () => set(true),
		end: () => set(false)
	};
};

export const loading = loadingStore();

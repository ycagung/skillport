<script lang="ts">
	import { loading } from '$lib/stores';
	import { LoaderCircle } from '@lucide/svelte';
	import { navigating } from '$app/state';

	$effect(() => {
		if (navigating.to) {
			loading.start();
		} else {
			loading.end();
		}
	});
</script>

{#if $loading}
	<div
		class="pointer-events-none fixed top-0 left-0 z-[999] flex h-screen w-screen items-center justify-center bg-neutral-50/50 dark:bg-neutral-950/50"
	>
		<LoaderCircle class="animate-spin" />
	</div>
{/if}

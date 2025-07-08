<script lang="ts">
	import Loading from '$lib/components/shared/loading.svelte';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />
{@render children()}
<Loading />

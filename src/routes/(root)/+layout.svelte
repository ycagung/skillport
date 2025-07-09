<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();

	console.log('Welcome!');
</script>

{@render children()}
<Toaster />

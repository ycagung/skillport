<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { SquareArrowOutUpRight } from '@lucide/svelte';

	let { id }: { id: string } = $props();
</script>

<Button
	variant="ghost"
	size="icon"
	onclick={() => goto(`/home/admin/users/${id}`)}
	><SquareArrowOutUpRight class="size-4" /></Button
>

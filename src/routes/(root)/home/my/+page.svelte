<script lang="ts">
	import Profile from '$lib/components/shared/profile.svelte';

	let { data } = $props();
</script>

<Profile user={data.user} />

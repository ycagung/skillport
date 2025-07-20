<script lang="ts">
	import DataTable from '$lib/components/shared/data-table.svelte';
	import { columns } from '$lib/components/tables/users/columns';

	let { data } = $props();

	console.log(data.users);
</script>

<DataTable title="Users" data={data.users} {columns} />

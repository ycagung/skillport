<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Textarea } from '$lib/components/ui/textarea';
	import { cn } from '$lib/utils';
	import type { FsSuperForm } from 'formsnap';

	let {
		form,
		value = $bindable(),
		name,
		type,
		label,
		placeholder,
		disabled = false,
		class: className
	}: {
		form: FsSuperForm<Record<string, unknown>, any>;
		value: any;
		name: string;
		type?: string;
		label: string;
		placeholder?: string;
		disabled?: boolean;
		class?: string;
	} = $props();
</script>

<Form.Field {form} {name} class={cn(className)}>
	<Form.Control>
		{#snippet children({ props }: { props: any })}
			<Form.Label>{label}</Form.Label>
			<Textarea
				{...props}
				bind:value
				{disabled}
				{placeholder}
				{type}
				class="resize-none text-sm placeholder:text-sm"
				rows="4"
			/>
		{/snippet}
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>

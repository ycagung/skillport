<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import type { FsSuperForm } from 'formsnap';
	import { Eye, EyeOff } from '@lucide/svelte';

	let {
		form,
		value = $bindable(),
		name,
		type = 'text',
		label,
		placeholder,
		disabled = false,
		hidden = false,
		class: className
	}: {
		form: FsSuperForm<Record<string, unknown>, any>;
		value: any;
		name: string;
		type?: 'text' | 'password';
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		hidden?: boolean;
		class?: string;
	} = $props();

	let passwordView = $state<boolean>(false);
</script>

<Form.Field {form} {name} class={cn(className)}>
	<Form.Control>
		{#snippet children({ props }: { props: any })}
			{#if label}
				<Form.Label>{label}</Form.Label>
			{/if}
			{#if type === 'password'}
				<div class="flex gap-2">
					<Input
						{...props}
						type={passwordView ? 'text' : 'password'}
						bind:value
						{disabled}
						{placeholder}
						{hidden}
					/>
					<Button
						onclick={() => (passwordView = !passwordView)}
						variant="outline"
						tabindex={-1}
						class="px-2"
						size="icon"
					>
						{#if passwordView}
							<EyeOff />
						{:else}
							<Eye />
						{/if}
					</Button>
				</div>
			{:else}
				<Input {...props} bind:value {disabled} {placeholder} {hidden} />
			{/if}
		{/snippet}
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>

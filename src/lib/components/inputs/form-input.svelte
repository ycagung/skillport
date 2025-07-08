<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import type { FsSuperForm } from 'formsnap';
	import { BadgeCheckIcon, Eye, EyeOff } from '@lucide/svelte';
	import { Badge } from '../ui/badge';

	let {
		form,
		value = $bindable(),
		name,
		type = 'text',
		label,
		placeholder,
		disabled = false,
		hidden = false,
		class: className,
		inputClass,
		showError = false,
		verified = false,
		onchange
	}: {
		form: FsSuperForm<Record<string, unknown>, any>;
		value?: any;
		name: string;
		type?: 'text' | 'password' | 'number';
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		hidden?: boolean;
		class?: string;
		inputClass?: string;
		showError?: boolean;
		verified?: boolean;
		onchange?: () => void;
	} = $props();

	let passwordView = $state<boolean>(false);
</script>

<Form.Field {form} {name} class={cn(className)}>
	<Form.Control>
		{#snippet children({ props }: { props: any })}
			{#if label}
				<div class="relative flex gap-2">
					<Form.Label {hidden}>{label}</Form.Label>
					{#if verified}
						<Badge
							variant="secondary"
							class="absolute -top-1 right-0 bg-sky-500 text-white dark:bg-sky-600"
						>
							<BadgeCheckIcon />
							<p class="text-xs">Verified</p>
						</Badge>
					{/if}
				</div>
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
						{onchange}
						class={cn(inputClass, 'mb-2 text-sm placeholder:text-sm')}
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
				<Input
					{...props}
					bind:value
					{type}
					{disabled}
					{placeholder}
					{hidden}
					{onchange}
					class={cn(
						inputClass,
						'mb-2 appearance-none text-sm placeholder:text-sm'
					)}
				/>
			{/if}
		{/snippet}
	</Form.Control>
	{#if showError}
		<Form.FieldErrors />
	{/if}
</Form.Field>

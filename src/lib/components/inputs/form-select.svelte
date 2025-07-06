<script lang="ts">
	import type { FsSuperForm } from 'formsnap';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { cn } from '$lib/utils';

	let {
		form,
		value = $bindable(),
		name,
		data,
		dataType = 'object',
		valueKey,
		labelKey,
		label,
		placeholder = '',
		disabled = false,
		class: className,
		slim = false,
		onValueChange = (v) => {
			value = v;
		}
	}: {
		form: FsSuperForm<Record<string, unknown>, any>;
		value: any;
		name: string;
		data: any[];
		dataType?: 'object' | 'string';
		valueKey?: string;
		labelKey?: string;
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		class?: string;
		slim?: boolean;
		onValueChange?: (v: string) => void;
	} = $props();

	if (dataType === 'object' && (!valueKey || !labelKey)) {
		throw new Error(
			'When dataType is "object", both valueKey and labelKey are required.'
		);
	}
</script>

<Form.Field
	{form}
	{name}
	class={cn(className, slim && 'flex items-center py-1', 'w-full')}
>
	<Form.Control>
		{#snippet children({ props }: { props: any })}
			{#if label}
				<Form.Label>{label}</Form.Label>
			{/if}
			<Select.Root type="single" name={props.name} {disabled} {onValueChange}>
				<Select.Trigger
					{...props}
					class={cn(slim && 'h-full border-0 bg-transparent', 'w-full')}
				>
					{#if value}
						{#if dataType === 'object'}
							{data.find((item) => item[valueKey!] === value)?.[labelKey!]}
						{:else if dataType === 'string'}
							{value}
						{/if}
					{:else}
						{placeholder}
					{/if}
				</Select.Trigger>
				<Select.Content>
					{#each data as item}
						{#if dataType === 'object'}
							<Select.Item value={item[valueKey!]} label={item[labelKey!]} />
						{:else if dataType === 'string'}
							<Select.Item value={item} label={item} />
						{/if}
					{/each}
				</Select.Content>
			</Select.Root>
		{/snippet}
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>

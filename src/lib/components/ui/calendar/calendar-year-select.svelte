<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { Calendar as CalendarPrimitive } from 'bits-ui';
	import { cn, type WithoutChildrenOrChild } from '$lib/utils.js';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';

	let {
		ref = $bindable(null),
		class: className,
		value,
		onValueChange,
		...restProps
	}: WithoutChildrenOrChild<CalendarPrimitive.YearSelectProps> & {
		onValueChange: (v: string) => void;
	} = $props();
</script>

<span
	class={cn(
		'has-focus:border-ring border-input has-focus:ring-ring/50 relative flex rounded-md border shadow-xs has-focus:ring-[3px]',
		className
	)}
>
	<CalendarPrimitive.YearSelect
		bind:ref
		class="absolute inset-0 opacity-0"
		{...restProps}
	>
		{#snippet child({ props, yearItems, selectedYearItem })}
			{@const items = yearItems.reverse()}
			<Select.Root type="single" {...props} {value} {onValueChange}>
				<Select.Trigger
					class="[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pr-1 pl-2 text-sm font-medium select-none [&>svg]:size-3.5"
					aria-hidden="true"
				>
					{yearItems.find((item) => item.value === value)?.label ||
						selectedYearItem.label}
					<!-- <ChevronDownIcon class="size-4" /> -->
				</Select.Trigger>
				<Select.Content>
					{#each items as yearItem (yearItem.value)}
						<Select.Item
							value={yearItem.value.toString()}
							data-selected={value !== undefined
								? yearItem.value === value
								: yearItem.value === selectedYearItem.value}
						>
							{yearItem.label}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		{/snippet}
	</CalendarPrimitive.YearSelect>
</span>

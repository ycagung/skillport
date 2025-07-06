<script lang="ts">
	import { Calendar as CalendarPrimitive } from 'bits-ui';
	import { cn, type WithoutChildrenOrChild } from '$lib/utils.js';
	import * as Select from '$lib/components/ui/select';

	let {
		ref = $bindable(null),
		class: className,
		value,
		onValueChange,
		...restProps
	}: WithoutChildrenOrChild<CalendarPrimitive.MonthSelectProps> & {
		onValueChange: (v: string) => void;
	} = $props();
</script>

<span
	class={cn(
		'has-focus:border-ring border-input has-focus:ring-ring/50 relative flex rounded-md border shadow-xs has-focus:ring-[3px]',
		className
	)}
>
	<CalendarPrimitive.MonthSelect
		bind:ref
		class="absolute inset-0 opacity-0"
		{...restProps}
	>
		{#snippet child({ props, monthItems, selectedMonthItem })}
			<Select.Root type="single" {...props} {onValueChange} {value}>
				<Select.Trigger
					class="[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pr-1 pl-2 text-sm font-medium select-none [&>svg]:size-3.5"
					aria-hidden="true"
				>
					<p class="mr-1">
						{monthItems.find((item) => item.value === value)?.label ||
							selectedMonthItem.label}
					</p>
					<!-- <ChevronDownIcon class="size-4" /> -->
				</Select.Trigger>
				<Select.Content class="w-fit">
					{#each monthItems as monthItem (monthItem.value)}
						<Select.Item
							value={monthItem.value.toString()}
							data-selected={value !== undefined
								? monthItem.value === value
								: monthItem.value === selectedMonthItem.value}
						>
							{monthItem.label}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		{/snippet}
	</CalendarPrimitive.MonthSelect>
</span>

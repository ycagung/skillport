<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Popover from '$lib/components/ui/popover';
	import { Calendar } from '$lib/components/ui/calendar';
	import type { FsSuperForm } from 'formsnap';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Calendar1 } from '@lucide/svelte';

	let {
		form,
		value = $bindable(),
		name,
		class: className,
		label,
		placeholder,
		hidden,
		disabled = false
	}: {
		form: FsSuperForm<Record<string, unknown>, any>;
		value: any;
		name: string;
		class?: string;
		label?: string;
		placeholder?: string;
		hidden?: boolean;
		disabled?: boolean;
	} = $props();

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let dateValue = $derived(value ? parseDate(value) : undefined);
	let datePlaceholder = $state<DateValue>(today(getLocalTimeZone()));
	let open = $state<boolean>(false);
</script>

<Form.Field {form} {name} class={cn(className, '', hidden && 'hidden')}>
	<Form.Control>
		{#snippet children({ props })}
			{#if label}
				<Form.Label>{label}</Form.Label>
			{/if}
			<Popover.Root bind:open>
				<Popover.Trigger
					{...props}
					class={cn(
						buttonVariants({ variant: 'outline' }),
						'w-full justify-start px-6 text-left text-sm font-normal',
						!dateValue && 'text-muted-foreground'
					)}
					{disabled}
				>
					{dateValue
						? df.format(dateValue.toDate(getLocalTimeZone()))
						: placeholder}
					<Calendar1 class="ml-auto size-4 opacity-50" />
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0" side="top">
					<Calendar
						type="single"
						value={dateValue as DateValue}
						bind:placeholder={datePlaceholder}
						minValue={new CalendarDate(1900, 1, 1)}
						maxValue={today(getLocalTimeZone())}
						calendarLabel="Date of birth"
						captionLayout="dropdown"
						onValueChange={(v) => {
							if (v) {
								value = v.toString();
							} else {
								value = '';
							}
							open = false;
						}}
					/>
				</Popover.Content>
			</Popover.Root>
			<input hidden {value} {name} />
		{/snippet}
	</Form.Control>
</Form.Field>

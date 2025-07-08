<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import type { FsSuperForm } from 'formsnap';
	import { useId } from 'bits-ui';
	import { buttonVariants } from '../ui/button';
	import { cn } from '$lib/utils';
	import { CheckIcon, ChevronsUpDownIcon } from '@lucide/svelte';
	import { tick } from 'svelte';

	let {
		form,
		name,
		value = $bindable(),
		label,
		placeholder,
		searchPlaceholder,
		disabled = false,
		hidden = false,
		class: className,
		data,
		labelKey,
		valueKey
	}: {
		form: FsSuperForm<Record<string, unknown>, any>;
		name: string;
		value: string | number;
		label?: string;
		placeholder?: string;
		searchPlaceholder?: string;
		disabled?: boolean;
		hidden?: boolean;
		class?: string;
		data: any[];
		labelKey: string;
		valueKey: string;
	} = $props();

	let open = $state<boolean>(false);
	let triggerId = $state(useId());

	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Form.Field {form} {name} class={cn(className)}>
	<Popover.Root bind:open>
		<Form.Control id={triggerId}>
			{#snippet children({ props })}
				<Form.Label>{label}</Form.Label>
				<Popover.Trigger
					class={cn(
						buttonVariants({ variant: 'outline' }),
						'w-full justify-between',
						!value && 'text-muted-foreground'
					)}
					role="combobox"
					{...props}
					{disabled}
					{hidden}
				>
					{data.find((f) => f[valueKey] === value)?.[labelKey] ?? placeholder}
					<ChevronsUpDownIcon class="opacity-50" />
				</Popover.Trigger>
				<input hidden {value} name={props.name} />
			{/snippet}
		</Form.Control>
		<Popover.Content class="max-h-[200px] p-0">
			<Command.Root>
				<Command.Input
					autofocus
					placeholder={searchPlaceholder || 'Search ...'}
					class="h-9"
				/>
				<Command.Empty>No data found.</Command.Empty>
				<Command.Group value="data">
					{#each data as item (item[valueKey])}
						<Command.Item
							value={item[labelKey]}
							onSelect={() => {
								value = item[valueKey];
								closeAndFocusTrigger(triggerId);
							}}
						>
							{item[labelKey]}
							<CheckIcon
								class={cn(
									'ml-auto',
									item[valueKey] !== value && 'text-transparent'
								)}
							/>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
	<!-- <Form.Description>
		This is the language that will be used in the dashboard.
	</Form.Description> -->
	<Form.FieldErrors />
</Form.Field>

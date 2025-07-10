<script lang="ts" generics="TData, TValue">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table';
	import { Input } from '$lib/components/ui/input';
	import * as Popover from '$lib/components/ui/popover';
	import * as Table from '$lib/components/ui/table';
	import { cn } from '$lib/utils';
	import {
		type ColumnDef,
		type ColumnFiltersState,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		type PaginationState,
		type RowSelectionState,
		type SortingState,
		type VisibilityState
	} from '@tanstack/table-core';
	import { ChevronsUpDown, PlusCircle, X } from '@lucide/svelte';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
	};

	let {
		data,
		columns,
		title
	}: DataTableProps<TData, TValue> & { title: string } = $props();

	let pageSize = 80;
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let rowSelection = $state<RowSelectionState>({});

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			}
		}
	});

	let keyword: string = $state('');
	let searchPopover: boolean = $state(false);
	const searchOptions = table.getHeaderGroups()[0].headers.map((h) => {
		return h.id;
	});
	let selectedFilter: string = $state('');
</script>

<div>
	<div class="flex items-center justify-between py-4">
		<p class="text-lg font-bold">{title}</p>
		<div class="min-w-[100px] md:min-w-[400px]">
			<Popover.Root bind:open={searchPopover}>
				<div class="flex gap-2">
					<Popover.Trigger
						class={cn(
							buttonVariants({ variant: 'outline' }),
							'w-full justify-between',
							keyword === '' && 'text-muted-foreground'
						)}
						role="combobox"
					>
						{keyword ? `${keyword} in ${selectedFilter}` : 'Filter'}
						<ChevronsUpDown class="opacity-50" />
					</Popover.Trigger>
					{#if keyword !== ''}
						<Button
							size="icon"
							variant="destructive"
							onclick={() => {
								table.resetColumnFilters();
								keyword = '';
								selectedFilter = '';
							}}><X class="size-4" /></Button
						>
					{/if}
				</div>
				<Popover.Content class="w-[100px] md:w-[400px]">
					<Command.Root>
						<Input
							autofocus
							bind:value={keyword}
							placeholder="Search language..."
							class="mb-4 h-8 outline-none"
						/>
						{#each searchOptions as opt, i}
							{#if i !== 0 && i !== searchOptions.length - 1}
								<Command.Item
									onSelect={() => {
										table.getColumn(opt)?.setFilterValue(keyword);
										selectedFilter = opt;
										searchPopover = false;
									}}
								>
									Search for <span class="font-semibold">"{keyword}"</span> in
									<span class="font-semibold capitalize italic">{opt}</span>
								</Command.Item>
							{/if}
						{/each}
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
		</div>
	</div>
	<div class="mt-2 h-[calc(100vh-250px)] overflow-scroll rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head class={cn(header.id === 'select' && 'pl-4')}>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row data-state={row.getIsSelected() && 'selected'}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell class={cn(cell.id.includes('select') && 'pl-4')}>
								<FlexRender
									content={cell.column.columnDef.cell}
									context={cell.getContext()}
								/>
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">
							No results.
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-between">
		<div class="text-muted-foreground flex-1 text-sm">
			{table.getFilteredSelectedRowModel().rows.length} selected. Total {table.getFilteredRowModel()
				.rows.length} rows.
		</div>
		<div class="flex items-center space-x-2 py-4">
			<p class="text-muted-foreground mr-2 text-xs font-semibold">
				Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
			</p>
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				Previous
			</Button>
			<p class="text-muted-foreground mr-2 text-xs font-semibold">
				{table.getState().pagination.pageIndex * pageSize + 1} - {table.getState()
					.pagination.pageIndex +
					1 ===
				table.getPageCount()
					? table.getFilteredRowModel().rows.length
					: (table.getState().pagination.pageIndex + 1) * pageSize}
			</p>
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				Next
			</Button>
		</div>
	</div>
</div>

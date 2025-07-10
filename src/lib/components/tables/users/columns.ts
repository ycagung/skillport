import { renderComponent } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import Actions from './actions.svelte';
import { Checkbox } from '../../ui/checkbox';

export const columns: ColumnDef<{
	id: string;
	name: string | null;
	email: string;
	verifiedEmail: boolean | null;
	boarded: boolean | null;
	phoneNumber: string | null;
}>[] = [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(Checkbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate:
					table.getIsSomePageRowsSelected() &&
					!table.getIsAllPageRowsSelected(),
				onCheckedChange: (value: boolean) =>
					table.toggleAllPageRowsSelected(!!value),
				controlledChecked: true,
				'aria-label': 'Select all'
			}),
		cell: ({ row }) =>
			renderComponent(Checkbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value: boolean) => row.toggleSelected(!!value),
				controlledChecked: true,
				'aria-label': 'Select row'
			}),
		enableSorting: false,
		enableHiding: false
	},

	{
		accessorKey: 'name',
		header: 'Nama'
	},
	{
		accessorKey: 'email',
		header: 'Email'
	},
	{
		accessorKey: 'phoneNumber',
		header: 'No. Telpon'
	},
	{
		accessorKey: 'boarded',
		header: 'Screening',
		cell: ({ row }) =>
			renderComponent(Checkbox, {
				checked: (row.getValue('boarded') as boolean) || undefined,
				disabled: true
			})
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(Actions, { id: row.original.id });
		}
	}
];

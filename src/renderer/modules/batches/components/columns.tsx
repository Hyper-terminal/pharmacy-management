import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/src/renderer/components/ui/Checkbox';

import { BatchProps } from '@/src/main/types';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<BatchProps>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'batch_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Batch Number" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('batch_number')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'medicine_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medicine Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue('medicine_name')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'expiry_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expiry Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue('expiry_date')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span>{row.getValue('quantity')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'manufacturer',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Manufacturer" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue('manufacturer')}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

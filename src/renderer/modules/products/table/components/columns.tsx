import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/src/renderer/components/ui/Checkbox';

import { Product } from '../data/schema';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: 'CODE',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('CODE')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'COMPANY',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue('COMPANY')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'SUPPLIER',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue('SUPPLIER')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'ITEM NAME',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Item Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[200px] items-center">
          <span>{row.getValue('ITEM NAME')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'EXPIRY',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expiry" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[80px]">
          <span>{row.getValue('EXPIRY')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'BATCH',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Batch" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[100px]">
          <span>{row.getValue('BATCH')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'PACK',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pack" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[80px]">
          <span>{row.getValue('PACK')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'QTY',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qty" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[60px] text-right">
          <span>{row.getValue('QTY')}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

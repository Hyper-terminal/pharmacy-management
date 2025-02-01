import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/src/renderer/components/ui/Checkbox';

import { MedicineProps } from '@/src/main/types';
import { DataTableColumnHeader } from './data-table-column-header';

export const columns: ColumnDef<MedicineProps>[] = [
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
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Code" />
  //   ),
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
  //   enableSorting: true,
  // },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue('name')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'hsn_code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="HSN Code" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue('hsn_code')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'total_qty',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Qty" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue('total_qty')}</span>
        </div>
      );
    },
  },
  // {
  //   accessorKey: 'batch_code',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Batch ID" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="w-[80px]">
  //         <span>{row.getValue('batch_code')}</span>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];

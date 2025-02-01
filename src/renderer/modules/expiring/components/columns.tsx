import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/src/renderer/components/ui/Checkbox';

import { BatchProps } from '@/src/main/types';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

function calculateDaysLeft(dateString) {
  // Get the current date and current year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Parse the input string (assumes "MM/YY" format)
  const [month, year] = dateString.split('/').map(Number);

  // Adjust year to be a full year (e.g., '23' -> 2023)
  const fullYear = year + 2000;

  // Create a Date object with the current or target year, and month
  let targetDate = new Date(fullYear, month - 1, 1); // Set to the first day of the target month

  // If the target date has already passed this year, set it to next year
  if (targetDate < currentDate) {
    targetDate.setFullYear(fullYear + 1);
  }

  // Calculate the difference in milliseconds
  const diffTime = targetDate - currentDate;

  // Convert milliseconds to days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

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
    accessorKey: 'batch_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Batch Number" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue('batch_id')}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medicine Name" />
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
    accessorKey: 'expiry_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Days Left" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {calculateDaysLeft(row.getValue('expiry_date'))}
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

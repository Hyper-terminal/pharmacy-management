import { Button } from '@/src/renderer/components/ui/Button';
import { PlusCircle } from 'lucide-react';
import DataTable from '@/src/renderer/modules/products/table/components/data-table';
import { columns } from '@/src/renderer/modules/products/table/components/columns';
import { tasksJson } from '@/src/renderer/modules/products/table/data/tasks';

export default function Products() {
  return (
    <div className="flex-col flex-1 h-full p-8 space-y-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          {/* <p className="text-muted-foreground"> */}
          {/* </p> */}
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </div>
      </div>

      <DataTable data={tasksJson} columns={columns} onRowClick={() => {}} />
    </div>
  );
}

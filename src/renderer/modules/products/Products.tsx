import { Button } from '@/src/renderer/components/ui/Button';
import { columns } from '@/src/renderer/modules/products/table/components/columns';
import DataTable from '@/src/renderer/modules/products/table/components/data-table';
import { INVOICE } from '@/src/renderer/modules/products/table/data/tasks';
import { PlusCircle } from 'lucide-react';

export default function Products() {
  return (
    <div className="flex-col max-w-full flex-1 h-full p-8 space-y-8 md:flex overflow-hidden overflow-y-auto">
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

      <div className="max-w-full overflow-x-auto">
        <DataTable data={INVOICE} columns={columns} onRowClick={() => {}} />
      </div>
    </div>
  );
}

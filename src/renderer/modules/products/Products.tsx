import { MedicineProps } from '@/src/main/types';
import { Button } from '@/src/renderer/components/ui/Button';
import { columns } from '@/src/renderer/modules/products/table/components/columns';
import DataTable from '@/src/renderer/modules/products/table/components/data-table';
import { PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Products() {
  const [products, setProducts] = useState<MedicineProps[]>([]);
  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-products').then((data) => {
      setProducts(data as MedicineProps[]);
    });

    window.electron.ipcRenderer.on('get-products', (...args: unknown[]) => {
      const data = args[1] as MedicineProps[];
      setProducts(data);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('get-products');
    };
  }, []);


  return (
    <div className="flex-col flex-1 h-full max-w-full p-8 space-y-8 overflow-hidden overflow-y-auto md:flex">
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

      <div className="overflow-x-auto ">
        <DataTable data={products} columns={columns} onRowClick={() => {}} />
      </div>
    </div>
  );
}

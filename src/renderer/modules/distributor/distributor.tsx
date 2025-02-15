import { DistributorProps } from '@/src/main/types';
import { columns } from '@/src/renderer/modules/distributor/table/components/columns';
import DataTable from '@/src/renderer/modules/distributor/table/components/data-table';
import { useEffect, useState } from 'react';

export default function Distributor() {
  const [distributors, setDistributors] = useState<DistributorProps[]>([]);
  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-distributors').then((data) => {
      setDistributors(data as DistributorProps[]);
    });

    window.electron.ipcRenderer.on('get-distributors', (...args: unknown[]) => {
      const data = args[1] as DistributorProps[];
      setDistributors(data);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('get-distributors');
    };
  }, []);

  return (
    <div className="flex-col flex-1 h-full max-w-full p-8 space-y-8 overflow-hidden overflow-y-auto md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Distributors</h2>
        </div>
      </div>

      <div className="overflow-x-auto ">
        <DataTable
          data={distributors}
          columns={columns}
          onRowClick={() => {}}
        />
      </div>
    </div>
  );
}

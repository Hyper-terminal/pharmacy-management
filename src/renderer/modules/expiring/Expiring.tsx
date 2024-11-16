import { BatchProps } from '@/src/main/types';
import { useEffect, useState } from 'react';
import TopBarLoader from '../../components/ui/TopBarLoader';
import { columns } from './components/columns';
import DataTable from './components/data-table';

export default function Expiring() {
  const [isLoading, setIsLoading] = useState(false);
  const [batches, setBatches] = useState<BatchProps[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-batches', { page: 1, limit: 10 })
      .then((data) => {
        setBatches(data as BatchProps[]);
        setIsLoading(false);
      });

    // window.electron.ipcRenderer.on('get-batches', (event, data) => {
    //   console.log('data arrived ', data);
    //   setBatches(data as BatchProps[]);
    //   setIsLoading(false);
    // });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('get-batches');
    };
  }, []);

  return (
    <>
      {isLoading && <TopBarLoader text="Loading batches..." />}
      <section className="flex flex-col gap-4 mt-10">
        <h2 className="text-2xl font-bold">Expiring Medicines</h2>

        <div className="mt-8">
          <div className="flex flex-col gap-4">
            <DataTable columns={columns} data={batches} onRowClick={() => {}} />
          </div>
        </div>
      </section>
    </>
  );
}

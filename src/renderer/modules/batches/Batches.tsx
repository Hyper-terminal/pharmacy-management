import { useEffect, useState } from 'react';
import DataTable from './components/data-table';
import { columns } from './components/columns';
import TopBarLoader from '../../components/ui/TopBarLoader';

export default function Batches() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  return (
    <>
      {isLoading && <TopBarLoader text="Loading batches..." />}
      <section className="flex flex-col gap-4 mt-10">
        <h2 className="text-2xl font-bold">Batches</h2>

        <div className="mt-8">
          <div className="flex flex-col gap-4">
            <DataTable columns={columns} data={[]} onRowClick={() => {}} />
          </div>
        </div>
      </section>
    </>
  );
}

import { Button } from '@/src/renderer/components/ui/Button';
import TopBarLoader from '@/src/renderer/components/ui/TopBarLoader';
import SingleProductAdd from '@/src/renderer/modules/add-product/SingleProduct';
import { FileTextIcon } from 'lucide-react';
import { useState } from 'react';
import CsvAdd from './CsvAdd';

export default function AddProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState<'single' | 'csv'>('csv');

  const handleTabChange = (tab: 'single' | 'csv') => {
    // setIsLoading((prev) => !prev);
    setCurrentTab(tab);
  };

  return (
    <>
      {isLoading && <TopBarLoader />}

      <section className="flex flex-col gap-4 mt-10">
        <h2 className="text-2xl font-bold">Add Product</h2>
        <div className="flex items-center gap-4">
          {/* <Button
            className="px-4 py-2"
            onClick={() => handleTabChange('single')}
          >
            <PlusCircledIcon className="w-5 h-5 mr-2" />
            Add Single Product
          </Button> */}
          <Button
            variant="secondary"
            className="px-4 py-2"
            onClick={() => handleTabChange('csv')}
          >
            <FileTextIcon className="w-5 h-5 mr-2" />
            Import CSV Products
          </Button>
        </div>
        {currentTab === 'single' && <SingleProductAdd />}
        {currentTab === 'csv' && (
          <CsvAdd isLoading={isLoading} onSetLoader={setIsLoading} />
        )}
      </section>
    </>
  );
}

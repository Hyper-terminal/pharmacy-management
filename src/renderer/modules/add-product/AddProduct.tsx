import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/renderer/components/ui/Tabs';
import TopBarLoader from '@/src/renderer/components/ui/TopBarLoader';
import SingleProductAdd from '@/src/renderer/modules/add-product/SingleProduct';
import { useState } from 'react';
import CsvAdd from './CsvAdd';
import AddDistributor from './AddDistributor';

export default function AddProduct() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading && <TopBarLoader />}

      <Tabs defaultValue="distributor" className="w-full">
        <TabsList>
          <TabsTrigger value="distributor">Distributor</TabsTrigger>
          <TabsTrigger value="single">Single</TabsTrigger>
          <TabsTrigger value="csv">CSV</TabsTrigger>
        </TabsList>
        <TabsContent className="w-full" value="distributor">
          <AddDistributor />
        </TabsContent>
        <TabsContent className="w-full" value="single">
          <SingleProductAdd />
        </TabsContent>
        <TabsContent className="w-full" value="csv">
          <CsvAdd isLoading={isLoading} onSetLoader={setIsLoading} />
        </TabsContent>
      </Tabs>
    </>
  );
}

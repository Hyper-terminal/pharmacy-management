import { useState } from 'react';
import { Button } from '@/src/renderer/components/ui/Button';
import TopBarLoader from '@/src/renderer/components/ui/TopBarLoader';
import { Input } from '@/src/renderer/components/ui/Input';
import { PlusIcon, PrinterIcon, TrashIcon } from 'lucide-react';

export default function Billing() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [billItems, setBillItems] = useState<Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>>([]);

  const handleSearchProduct = (term: string) => {
    setSearchTerm(term);
    // TODO: Implement product search functionality
  };

  const handleAddItem = () => {
    // TODO: Implement add item to bill functionality
  };

  const handleRemoveItem = (id: string) => {
    setBillItems(billItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return billItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handlePrintBill = () => {
    setIsLoading(true);
    // TODO: Implement bill printing functionality
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <>
      {isLoading && <TopBarLoader text="Generating Bill..." />}

      <section className="flex flex-col gap-6 mt-10">
        <h2 className="text-2xl font-bold">Billing</h2>

        <div className="flex gap-4">
          <div className="w-2/3 flex flex-col gap-4">
            <div className="flex gap-2">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearchProduct(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddItem}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              {/* Header */}
              <div className="grid grid-cols-5 gap-4 pb-2 border-b font-semibold">
                <div className="text-left">Product</div>
                <div className="text-right">Quantity</div>
                <div className="text-right">Price</div>
                <div className="text-right">Total</div>
                <div className="text-right">Action</div>
              </div>

              {/* Bill Items */}
              <div className="flex flex-col">
                {billItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-5 gap-4 py-3 border-b items-center">
                    <div className="text-left">{item.name}</div>
                    <div className="text-right">{item.quantity}</div>
                    <div className="text-right">${item.price.toFixed(2)}</div>
                    <div className="text-right">${item.total.toFixed(2)}</div>
                    <div className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-1/3 border rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">Bill Summary</h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%):</span>
                <span>${(calculateTotal() * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                <span>Total:</span>
                <span>${(calculateTotal() * 1.05).toFixed(2)}</span>
              </div>
              <Button
                className="w-full mt-4"
                onClick={handlePrintBill}
                disabled={billItems.length === 0}
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print Bill
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

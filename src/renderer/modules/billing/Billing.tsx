import { useState } from 'react';
import { Button } from '@/src/renderer/components/ui/Button';
import TopBarLoader from '@/src/renderer/components/ui/TopBarLoader';
import { Input } from '@/src/renderer/components/ui/Input';
import { PlusIcon, PrinterIcon, TrashIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Addbilling from './Addbilling';
// import DataTable from '@/src/renderer/modules/products/table/components/data-table';
// import { columns } from '@/src/renderer/modules/products/table/components/columns';

export default function Billing() {
  const [isLoading, setIsLoading] = useState(false);
  const [showAdditem, setShowaddItem] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [billItems, setBillItems] = useState<
    Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
      total: number;
    }>
  >([]);

  const handleSearchProduct = (term: string) => {
    setSearchTerm(term);
    // TODO: Implement product search functionality
  };

  const handleAddItem = () => {
    setShowaddItem(!showAdditem);
    // TODO: Implement add item to bill functionality
  };

  const handleRemoveItem = (id: string) => {
    setBillItems(billItems.filter((item) => item.id !== id));
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isLoading && <TopBarLoader text="Generating Bill..." />}

      <section className="flex flex-col gap-6 mt-10">
        {showAdditem ? <Additemform /> : null}
        <motion.h2
          className="text-2xl font-bold"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Billing
        </motion.h2>

        <div className="flex gap-4">
          <motion.div
            className="flex flex-col w-2/3 gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex gap-2">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearchProduct(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddItem}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            <motion.div
              className="p-4 border rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="grid grid-cols-5 gap-4 pb-2 font-semibold border-b">
                <div className="text-left">Product</div>
                <div className="text-right">Quantity</div>
                <div className="text-right">Price</div>
                <div className="text-right">Total</div>
                <div className="text-right">Action</div>
              </div>

              <AnimatePresence mode="popLayout">
                {billItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="grid items-center grid-cols-5 gap-4 py-3 border-b"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
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
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          <motion.div
            className="w-1/3 p-4 border rounded-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="mb-4 text-xl font-semibold">Bill Summary</h3>
            <div className="flex flex-col gap-2">
              <motion.div
                className="flex justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span>Subtotal:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </motion.div>
              <motion.div
                className="flex justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <span>Tax (5%):</span>
                <span>${(calculateTotal() * 0.05).toFixed(2)}</span>
              </motion.div>
              <motion.div
                className="flex justify-between pt-2 mt-2 text-lg font-bold border-t"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <span>Total:</span>
                <span>${(calculateTotal() * 1.05).toFixed(2)}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  className="w-full mt-4"
                  onClick={handlePrintBill}
                  disabled={billItems.length === 0}
                >
                  <PrinterIcon className="w-4 h-4 mr-2" />
                  Print Bill
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

const Additemform = () => {
  return (
    <div>
      <div className="overflow-x-auto "></div>
      <Addbilling />
    </div>
  );
};

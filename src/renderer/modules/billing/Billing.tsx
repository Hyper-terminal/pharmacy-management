import { Badge } from '@/src/renderer/components/ui/Badge';
import { Button } from '@/src/renderer/components/ui/Button';
import { Input } from '@/src/renderer/components/ui/Input';
import TopBarLoader from '@/src/renderer/components/ui/TopBarLoader';
import { cn } from '@/src/renderer/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { PrinterIcon, ReceiptIcon, SearchIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/Dialog';
import Addbilling from './Addbilling';

export default function Billing() {
  const [isLoading, setIsLoading] = useState(false);
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

  const getTotalItems = () =>
    billItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-6 bg-gradient-to-b from-background to-background/50"
    >
      {isLoading && <TopBarLoader text="Generating Bill..." />}

      <section className="flex flex-col gap-6">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <ReceiptIcon className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-primary to-purple-600 bg-clip-text">
                Billing
              </h2>
              <p className="text-sm text-muted-foreground">
                {billItems.length > 0 ? (
                  <>
                    <Badge variant="secondary" className="mr-2">
                      {billItems.length}{' '}
                      {billItems.length === 1 ? 'item' : 'items'}
                    </Badge>
                    <span>Total Items: {getTotalItems()}</span>
                  </>
                ) : (
                  'Create a new bill'
                )}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-6">
          <motion.div
            className="flex flex-col w-2/3 gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex gap-3">
              <div className="relative flex-1 group">
                <SearchIcon className="absolute w-4 h-4 text-gray-400 transition-colors transform -translate-y-1/2 left-3 top-1/2 group-focus-within:text-primary" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => handleSearchProduct(e.target.value)}
                  className="pl-10 transition-all duration-300 border-gray-200 rounded-full hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <AddItemForm />
            </div>

            <motion.div
              className={cn(
                'p-6 border rounded-xl shadow-sm bg-white/50 backdrop-blur-sm',
                'dark:bg-gray-900/50 dark:border-gray-800',
                'transition-all duration-300',
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="grid grid-cols-5 gap-4 pb-3 mb-3 font-semibold border-b dark:border-gray-800">
                <div className="text-left text-gray-600 dark:text-gray-400">
                  Product
                </div>
                <div className="text-right text-gray-600 dark:text-gray-400">
                  Quantity
                </div>
                <div className="text-right text-gray-600 dark:text-gray-400">
                  Price
                </div>
                <div className="text-right text-gray-600 dark:text-gray-400">
                  Total
                </div>
                <div className="text-right text-gray-600 dark:text-gray-400">
                  Action
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {billItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="relative inline-block">
                      <ReceiptIcon className="w-16 h-16 mx-auto mb-3 opacity-20" />
                      <motion.div
                        className="absolute inset-0 rounded-full animate-ping"
                        style={{
                          background:
                            'radial-gradient(circle, rgba(var(--primary-rgb), 0.2) 0%, transparent 70%)',
                        }}
                      />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      No items added to the bill yet
                    </p>
                    <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                      Click &quot;Add Item&quot; to get started
                    </p>
                  </motion.div>
                ) : (
                  billItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className={cn(
                        'grid items-center grid-cols-5 gap-4 py-3 transition-colors',
                        'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                        'border-b dark:border-gray-800',
                        index === billItems.length - 1 && 'border-b-0',
                      )}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="font-medium text-left">{item.name}</div>
                      <div className="text-right">{item.quantity}</div>
                      <div className="text-right">${item.price.toFixed(2)}</div>
                      <div className="font-semibold text-right text-primary">
                        ${item.total.toFixed(2)}
                      </div>
                      <div className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="transition-all opacity-0 hover:scale-105 active:scale-95 group-hover:opacity-100"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
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

const AddItemForm = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="transition-all duration-300 ">
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Add Item
          </motion.div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
            Add New Item
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new item to your bill. Please fill in the item details below
            ✨
          </DialogDescription>
        </DialogHeader>
        <Addbilling />
      </DialogContent>
    </Dialog>
  );
};

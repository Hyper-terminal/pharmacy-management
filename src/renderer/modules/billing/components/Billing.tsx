import { Badge } from '@/src/renderer/components/ui/Badge';
import { Button } from '@/src/renderer/components/ui/Button';
import { Input } from '@/src/renderer/components/ui/Input';
import TopBarLoader from '@/src/renderer/components/ui/TopBarLoader';
import { AnimatePresence, motion } from 'framer-motion';
import {
  PrinterIcon,
  ReceiptIcon,
  SearchIcon,
  StethoscopeIcon,
  UserIcon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from '../../../components/ui/Dialog';
import { customerDetailsSchema, mapBillingFormFields } from '../schema';
import Addbilling from './Addbilling';
import { BillItem } from './BillItem';
import RecentBills from './RecentBills';

export default function Billing() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [billItems, setBillItems] = useState<any[]>([]);
  const [customerDetails, setCustomerDetails] = useState({
    customer_name: '',
    customer_phone: '',
    doctor_name: '',
    doctor_phone: '',
  });

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
    try {
      customerDetailsSchema.parse(customerDetails);
    } catch (error) {
      toast.error('Please fill in valid customer details');
      return;
    }

    try {
      setIsLoading(true);
      window.electron.ipcRenderer.invoke('add-bill', {
        items: billItems.map((item) => mapBillingFormFields(item)),
        customer: customerDetails,
      });
    } catch (error) {
      toast.error('Failed to generate bill');
      setIsLoading(false);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        toast.success('Bill generated successfully!');
      }, 1000);
    }
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

        <motion.div
          className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-background/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-medium">Customer Details</h3>
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Customer Name"
                value={customerDetails.customer_name}
                onChange={(e) =>
                  setCustomerDetails((prev) => ({
                    ...prev,
                    customer_name: e.target.value,
                  }))
                }
                className="transition-all duration-300"
              />
              <Input
                placeholder="Customer Phone"
                value={customerDetails.customer_phone}
                onChange={(e) =>
                  setCustomerDetails((prev) => ({
                    ...prev,
                    customer_phone: e.target.value,
                  }))
                }
                className="transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <StethoscopeIcon className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-medium">Doctor Details</h3>
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Doctor Name"
                value={customerDetails.doctor_name}
                onChange={(e) =>
                  setCustomerDetails((prev) => ({
                    ...prev,
                    doctor_name: e.target.value,
                  }))
                }
                className="transition-all duration-300"
              />
              <Input
                placeholder="Doctor Phone"
                value={customerDetails.doctor_phone}
                onChange={(e) =>
                  setCustomerDetails((prev) => ({
                    ...prev,
                    doctor_phone: e.target.value,
                  }))
                }
                className="transition-all duration-300"
              />
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
              <AddItemForm setBillItems={setBillItems} />
            </div>

            <motion.div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {billItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center p-8 text-center border rounded-xl bg-background/50"
                  >
                    <div className="relative p-4">
                      <ReceiptIcon className="w-12 h-12 text-muted-foreground/30" />
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <div className="w-full h-full rounded-full bg-primary/10" />
                      </motion.div>
                    </div>
                    <h3 className="mt-4 text-lg font-medium">
                      No Items in Bill
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Start by searching for products or click &quot;Add
                      Item&quot;
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-2">
                    {billItems.map((item, index) => (
                      <BillItem
                        key={item.id}
                        item={item}
                        index={index}
                        onRemove={handleRemoveItem}
                        onUpdateQuantity={(name: string, newQty: number) => {
                          setBillItems((items) =>
                            items.map((item) =>
                              item?.NAME?.name === name
                                ? {
                                    ...item,
                                    QTY: newQty,
                                    total: newQty * Number(item.PRICE),
                                  }
                                : item,
                            ),
                          );
                        }}
                      />
                    ))}
                  </div>
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
                <span>${calculateTotal()?.toFixed(2)}</span>
              </motion.div>
              <motion.div
                className="flex justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <span>Tax (5%):</span>
                <span>${(calculateTotal() * 0.05)?.toFixed(2)}</span>
              </motion.div>
              <motion.div
                className="flex justify-between pt-2 mt-2 text-lg font-bold border-t"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <span>Total:</span>
                <span>${(calculateTotal() * 1.05)?.toFixed(2)}</span>
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
                  Generate Bill
                </Button>
              </motion.div>
            </div>
            <RecentBills />
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

const AddItemForm = ({
  setBillItems,
}: {
  setBillItems: (items: any[]) => void;
}) => {
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
      <DialogContent className="max-h-[80vh] w-[60vw] overflow-y-auto backdrop-blur-xl">
        <Addbilling setBillItems={setBillItems} />
      </DialogContent>
    </Dialog>
  );
};

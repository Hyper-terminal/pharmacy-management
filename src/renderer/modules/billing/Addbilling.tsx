import { Button } from '@/src/renderer/components/ui/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/renderer/components/ui/Form';
import { Input } from '@/src/renderer/components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
// import { singleProductSchema } from './schema';
import { motion } from 'framer-motion';
import { Calculator, Receipt } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AddMedicineDropdown from './AddMedicineDropdown';
import { Billingschema } from './schema';

export default function Addbilling() {
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<z.infer<typeof Billingschema>>({
    resolver: zodResolver(Billingschema),
    defaultValues: {
      NAME: '',
      'MEDICINE ID': 0,
      'BATCH ID': 0,
      DATE: new Date().toISOString().split('T')[0],
      DISCOUNT: 0,
      TAX: 0,
      QTY: 0,
      PRICE: 0,
      'FINAL PRICE': 0,
      'CUSTOMER NAME': '',
      'CUSTOMER PHONE': '',
      HSN: 0,
    },
  });

  const watchQty = form.watch('QTY');
  const watchPrice = form.watch('PRICE');
  const watchDiscount = form.watch('DISCOUNT');
  const watchTax = form.watch('TAX');

  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => {
      const subtotal = watchQty * watchPrice;
      const discountAmount = (subtotal * watchDiscount) / 100;
      const afterDiscount = subtotal - discountAmount;
      const taxAmount = (afterDiscount * watchTax) / 100;
      const finalPrice = afterDiscount + taxAmount;

      form.setValue('FINAL PRICE', Number(finalPrice.toFixed(2)));
      setIsCalculating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [watchQty, watchPrice, watchDiscount, watchTax]);

  async function onSubmit(values: z.infer<typeof Billingschema>) {
    try {
      console.log(values, isCalculating);
      toast.success('Bill added successfully!');
    } catch (error) {
      toast.error('Failed to add bill');
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-white border shadow-lg rounded-xl dark:bg-gray-800/50 backdrop-blur-sm dark:border-gray-700"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-lg bg-blue-500/10">
          <Receipt className="w-6 h-6 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
          New Bill
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Medicine Details Section */}
            <div className="col-span-full">
              <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                Medicine Details
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="NAME"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medicine Name</FormLabel>
                      <FormControl>
                        <AddMedicineDropdown
                          onSelect={(medicine) => {
                            form.setValue('MEDICINE ID', medicine.id);
                            form.setValue(
                              'BATCH ID',
                              Number(medicine.batch_id),
                            );
                            form.setValue('PRICE', medicine.amount);
                          }}
                          field={field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="MEDICINE ID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medicine ID</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="BATCH ID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch ID</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Pricing Section */}
            <div className="col-span-full">
              <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                <Calculator className="w-5 h-5 text-blue-500" />
                Pricing Details
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <FormField
                  control={form.control}
                  name="QTY"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="PRICE"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="DISCOUNT"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (%)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="TAX"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax (%)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="FINAL PRICE"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Final Price</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          className="transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 bg-gray-50 dark:bg-gray-800 dark:text-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full transition-all duration-300 md:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Add bill
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}

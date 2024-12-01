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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/renderer/components/ui/Select';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Calculator, Receipt } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Billingschema } from '../schema';
import AddMedicineDropdown from './AddMedicineDropdown';
import { getPerPriceMedicine } from '@/src/renderer/utils';
import { cn } from '@/src/renderer/lib/utils';
import { PlusIcon, CalendarIcon, Package2Icon } from 'lucide-react';
import { Badge } from '@/src/renderer/components/ui/Badge';

export default function Addbilling({ setBillItems }: { setBillItems: any }) {
  const form = useForm({
    resolver: zodResolver(Billingschema),
    defaultValues: {
      NAME: {
        id: 0,
        name: '',
        total_qty: '',
        batchData: [],
        nearestExpiryBatch: {
          mrp: '0',
          batch_id: '',
          expiry_date: '',
          manufacturer: '',
        },
      },
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

  // Price calculation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const subtotal = form.watch('QTY') * form.watch('PRICE');
      const discountAmount = (subtotal * form.watch('DISCOUNT')) / 100;
      const afterDiscount = subtotal - discountAmount;
      const taxAmount = (afterDiscount * form.watch('TAX')) / 100;
      form.setValue(
        'FINAL PRICE',
        Number((afterDiscount + taxAmount).toFixed(2)),
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [
    form.watch('QTY'),
    form.watch('PRICE'),
    form.watch('DISCOUNT'),
    form.watch('TAX'),
  ]);

  async function onSubmit(values: any) {
    try {
      setBillItems((prev: any[]) => [...prev, values]);
      toast.success('Item added successfully!');
    } catch (error) {
      toast.error('Failed to add item');
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full mx-auto space-y-6"
    >
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10"
        >
          <Receipt className="w-6 h-6 text-primary" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
            Add New Item
          </h2>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to add a new item to the bill
          </p>
        </div>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Medicine Details Section */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200/50 dark:border-gray-800/50">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Package2Icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-medium text-foreground">
                  Medicine Details
                </h3>
              </div>

              <div className="space-y-4">
                {/* Medicine Name Field */}
                <FormField
                  control={form.control}
                  name="NAME"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground/80">
                        Medicine Name
                      </FormLabel>
                      <FormControl>
                        <AddMedicineDropdown
                          onSelect={(medicine) => {
                            form.setValue('MEDICINE ID', medicine.id);
                            form.setValue(
                              'BATCH ID',
                              Number(medicine.nearestExpiryBatch.batch_id),
                            );
                            form.setValue(
                              'PRICE',
                              Number(medicine.nearestExpiryBatch.mrp),
                            );
                          }}
                          field={field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Batch Selection */}
                <FormField
                  control={form.control}
                  name="BATCH ID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground/80">
                        Select Batch
                      </FormLabel>
                      <Select
                        value={String(field.value)}
                        onValueChange={(value) => {
                          if (!value) return;
                          field.onChange(value);
                          const medicineData = form.getValues('NAME');
                          const selectedBatch: any =
                            medicineData?.batchData?.find(
                              (batch: any) => batch.batch_id === value,
                            );
                          if (selectedBatch) {
                            form.setValue(
                              'PRICE',
                              getPerPriceMedicine(
                                String(medicineData.total_qty),
                                String(selectedBatch.amount),
                              ),
                            );
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-10 transition-all border-input bg-background hover:bg-accent hover:text-accent-foreground">
                            <SelectValue placeholder="Choose a batch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <div className="max-h-[200px] overflow-y-auto">
                            {form
                              .getValues('NAME')
                              ?.batchData?.map((batch: any) => (
                                <SelectItem
                                  hideCheckIcon={true}
                                  key={batch.batch_id}
                                  value={batch.batch_id}
                                  className="relative p-3 transition-colors hover:bg-accent"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                      <span className="font-medium">
                                        {batch.batch_id}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {batch.manufacturer}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                      <CalendarIcon className="w-3 h-3 text-primary" />
                                      {new Date(batch.expiry_date) <
                                      new Date() ? (
                                        <span className="font-medium text-destructive">
                                          Expired
                                        </span>
                                      ) : (
                                        <span
                                          className={cn(
                                            'font-medium',
                                            new Date(batch.expiry_date) <
                                              new Date(
                                                Date.now() +
                                                  90 * 24 * 60 * 60 * 1000,
                                              )
                                              ? 'text-yellow-500'
                                              : 'text-green-500',
                                          )}
                                        >
                                          {new Date(
                                            batch.expiry_date,
                                          ).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                          </div>
                        </SelectContent>
                      </Select>
                      {field.value
                        ? form.getValues('NAME')?.batchData && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              {(() => {
                                const selectedBatch: any = form
                                  .getValues('NAME')
                                  ?.batchData?.find(
                                    (batch: any) =>
                                      batch.batch_id === field.value,
                                  );
                                if (selectedBatch) {
                                  const expiryDate = new Date(
                                    selectedBatch.expiry_date,
                                  );
                                  const daysUntilExpiry = Math.ceil(
                                    (expiryDate.getTime() - Date.now()) /
                                      (1000 * 60 * 60 * 24),
                                  );
                                  return (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="flex items-center gap-2 p-2 rounded-lg bg-primary/5"
                                    >
                                      <CalendarIcon className="w-4 h-4 text-primary" />
                                      <span>
                                        {daysUntilExpiry > 0
                                          ? `Expires in ${daysUntilExpiry} days`
                                          : 'Expired'}
                                      </span>
                                    </motion.div>
                                  );
                                }
                              })()}
                            </div>
                          )
                        : null}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>

            {/* Pricing Details Section */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200/50 dark:border-gray-800/50">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Calculator className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-medium text-foreground">
                  Pricing Details
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {['QTY', 'PRICE', 'DISCOUNT', 'TAX'].map((fieldName) => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground/80">
                          {fieldName === 'QTY'
                            ? 'Quantity'
                            : fieldName.charAt(0) +
                              fieldName.slice(1).toLowerCase()}
                          {(fieldName === 'DISCOUNT' || fieldName === 'TAX') &&
                            ' (%)'}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type="number"
                              readOnly={fieldName === 'PRICE'}
                              className={cn(
                                'h-10 pl-8 transition-all border-input bg-background',
                                fieldName === 'PRICE' &&
                                  'bg-muted cursor-not-allowed',
                                'focus-visible:ring-1 focus-visible:ring-primary',
                              )}
                            />
                            <div className="absolute inset-y-0 flex items-center left-3 text-muted-foreground">
                              {fieldName === 'PRICE' && '₹'}
                              {fieldName === 'QTY' && '#'}
                              {(fieldName === 'DISCOUNT' ||
                                fieldName === 'TAX') &&
                                '%'}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* Final Price Field */}
              <FormField
                control={form.control}
                name="FINAL PRICE"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel className="text-sm font-medium text-foreground/80">
                      Final Price
                    </FormLabel>
                    <FormControl>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="relative">
                          <Input
                            {...field}
                            readOnly
                            className="h-12 pl-8 text-lg font-medium border-input bg-gradient-to-r from-primary/5 to-purple-500/5"
                          />
                          <div className="absolute inset-y-0 flex items-center left-3 text-primary">
                          ₹
                          </div>
                        </div>
                      </motion.div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>

          <motion.div
            className="flex justify-end pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              type="submit"
              className="relative overflow-hidden group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              <span className="relative z-10 flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                Add to Bill
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/90 to-purple-600/90"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}

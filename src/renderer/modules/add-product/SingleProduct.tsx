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
import { toast } from 'sonner';
import { z } from 'zod';
import { singleProductSchema } from './schema';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function SingleProductAdd() {
  const [isLoadingGst, setIsLoadingGst] = useState(false);
  const form = useForm<z.infer<typeof singleProductSchema>>({
    resolver: zodResolver(singleProductSchema),
    defaultValues: {
      supplier: '',
      bill_number: '',
      received_date: new Date().toISOString().split('T')[0],
      manufacturer: '',
      barcode: '',
      pack: '',
      batch_code: '',
      expiry_date: '',
      quantity: 0,
      f_qty: 0,
      half_qty: 0,
      purchase_rate: 0,
      sale_rate: 0,
      mrp: 0,
      discount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      additional_vat: 0,
      amount: 0,
      local_cent: 0,
      scm1: 0,
      scm2: 0,
      scm_percentage: 0,
      tcs_percentage: 0,
      tcs_amount: 0,
      po_number: '',
      po_date: '',
      hsn_code: '',
    },
  });

  // Effect to fetch GST rates when HSN code changes
  useEffect(() => {
    const hsnCode = form.watch('hsn_code');
    if (hsnCode) {
      setIsLoadingGst(true);
      const fetchGstRates = async () => {
        try {
          const result = await window.electron.ipcRenderer.invoke(
            'get-gst-data',
            hsnCode,
          );
          if (result) {
            form.setValue('cgst', Number(result.cgstRate?.split('%')[0]) || 0);
            form.setValue('sgst', Number(result.sgstRate?.split('%')[0]) || 0);
            form.setValue('igst', Number(result.igstRate?.split('%')[0]) || 0);
          }
        } catch (error) {
          console.error('Error fetching GST rates:', error);
        } finally {
          setIsLoadingGst(false);
        }
      };

      // Debounce the HSN code lookup
      const timer = setTimeout(() => {
        fetchGstRates();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [form.watch('hsn_code')]);

  async function onSubmit(values: z.infer<typeof singleProductSchema>) {
    try {
      console.log({ values });
      // await window.electron.ipcRenderer.invoke('add-product', values);
      toast.success('Product added successfully');
      form.reset();
    } catch (error) {
      toast.error('Failed to add product');
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bill_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bill Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="received_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Received Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="batch_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expiry_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mrp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MRP</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purchase_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Rate</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sale_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sale Rate</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hsn_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HSN Code</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} placeholder="Enter HSN Code" />
                    {isLoadingGst && (
                      <div className="absolute -translate-y-1/2 right-3 top-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cgst"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CGST (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sgst"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SGST (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="igst"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IGST (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Add Product</Button>
      </form>
    </Form>
  );
}

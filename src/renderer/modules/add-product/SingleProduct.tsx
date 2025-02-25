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
import { singleProductSchema, PackType, PackTypeDisplay } from './schema';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/renderer/components/ui/Select';

export default function SingleProductAdd() {
  const [isLoadingGst, setIsLoadingGst] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<z.infer<typeof singleProductSchema>>({
    resolver: zodResolver(singleProductSchema),
    defaultValues: {
      supplier: '',
      bill_number: '',
      received_date: '',
      manufacturer: '',
      medicine_name: '',
      barcode: '',
      pack: PackType.TABLET,
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
      po_date: '01/01/2001',
      hsn_code: '',
      quantity_per_pack: 1,
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

  // Effect to fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const result =
          await window.electron.ipcRenderer.invoke('get-distributors');
        if (result) {
          setSuppliers(result);
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
  }, []);

  const formatDateInput = (value: string) => {
    // Remove any non-digit characters
    let cleaned = value.replace(/\D/g, '');

    // Format as DD/MM/YY
    if (cleaned.length >= 4) {
      cleaned =
        cleaned.slice(0, 2) +
        '/' +
        cleaned.slice(2, 4) +
        '/' +
        cleaned.slice(4, 8);
    } else if (cleaned.length >= 2) {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }

    // Validate day (01-31)
    const day = parseInt(cleaned.slice(0, 2));
    if (day > 31) {
      cleaned = '31' + cleaned.slice(2);
    } else if (day < 1 && cleaned.length >= 2) {
      cleaned = '01' + cleaned.slice(2);
    }

    // Validate month (01-12)
    if (cleaned.length >= 5) {
      const month = parseInt(cleaned.slice(3, 5));
      if (month > 12) {
        cleaned = cleaned.slice(0, 3) + '12' + cleaned.slice(5);
      } else if (month < 1) {
        cleaned = cleaned.slice(0, 3) + '01' + cleaned.slice(5);
      }
    }

    return cleaned;
  };

  async function onSubmit(values: z.infer<typeof singleProductSchema>) {
    try {
      console.log(values);
      return;
      const result = await window.electron.ipcRenderer.invoke(
        'add-single-product',
        values,
      );

      if (result.success) {
        toast.success('Product added successfully');
        form.reset();
      } else {
        toast.error(`Failed to add product: ${result.error}`);
      }
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <div className="p-1">
                      <Input
                        placeholder="Search suppliers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    {suppliers
                      .filter((supplier: any) =>
                        supplier.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                      )
                      .map((supplier: any) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="medicine_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medicine Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter medicine name" />
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
                  <Input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => {
                      const formattedDate = formatDateInput(e.target.value);
                      field.onChange(formattedDate);
                    }}
                  />
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
                  <Input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => {
                      const formattedDate = formatDateInput(e.target.value);
                      field.onChange(formattedDate);
                    }}
                  />
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
          <FormField
            control={form.control}
            name="pack"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pack Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pack type">
                        {field.value
                          ? PackTypeDisplay[
                              field.value as keyof typeof PackTypeDisplay
                            ]
                          : ''}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(PackType).map(([, value]) => (
                      <SelectItem key={value} value={value}>
                        {PackTypeDisplay[value as keyof typeof PackTypeDisplay]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
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
            name="quantity_per_pack"
            render={({ field }) => {
              const packType = form.watch('pack');
              const qtyPerPack = form.watch('quantity_per_pack') || 1;

              const displayValue = `${qtyPerPack}${packType}`;

              return (
                <FormItem>
                  <FormLabel>Quantity Per Pack</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <div className="absolute inset-y-0 flex items-center text-sm right-3 text-muted-foreground">
                        {displayValue}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <Button type="submit">Add Product</Button>
      </form>
    </Form>
  );
}

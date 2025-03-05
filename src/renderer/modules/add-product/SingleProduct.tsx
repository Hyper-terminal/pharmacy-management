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
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { singleProductSchema, PackType, PackTypeDisplay } from './schema';
import { useEffect, useRef, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/renderer/components/ui/Select';
import { Card, CardContent } from '@/src/renderer/components/ui/Card';

// Define the schema for multiple products
const multipleProductsSchema = z.object({
  products: z.array(singleProductSchema),
});

export default function SingleProductAdd() {
  const [isLoadingGst, setIsLoadingGst] = useState<Record<number, boolean>>({});
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Create empty product template
  const emptyProduct = {
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
  };

  // Setup form with array field for multiple products
  const form = useForm({
    resolver: zodResolver(multipleProductsSchema),
    defaultValues: {
      products: [emptyProduct],
    },
  });

  // Use field array for handling multiple products
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'products',
  });

  // fetch hsn code from database
  const timer: any = useRef<NodeJS.Timeout | null>(null);
  const fetchHsnCode = async (hsnCode: string, index: number) => {
    if (hsnCode) {
      setIsLoadingGst((prev) => ({ ...prev, [index]: true }));
      const fetchGstRates = async () => {
        try {
          const result = await window.electron.ipcRenderer.invoke(
            'get-gst-data',
            hsnCode,
          );
          if (result) {
            console.log(result);
            form.setValue(
              `products.${index}.cgst`,
              Number(result.cgstRate?.split('%')[0]) || 0,
            );
            form.setValue(
              `products.${index}.sgst`,
              Number(result.sgstRate?.split('%')[0]) || 0,
            );
            form.setValue(
              `products.${index}.igst`,
              Number(result.igstRate?.split('%')[0]) || 0,
            );
          }
        } catch (error) {
          console.error('Error fetching GST rates:', error);
        } finally {
          setIsLoadingGst((prev) => ({ ...prev, [index]: false }));
        }
      };

      // Debounce the HSN code lookup
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        fetchGstRates();
      }, 500);
    }
  };

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

  async function onSubmit(values: z.infer<typeof multipleProductsSchema>) {
    try {
      const result = await window.electron.ipcRenderer.invoke(
        'add-manual-product',
        values.products,
      );

      if (!result?.success) {
        toast.error(`Failed to add product: ${result.error}`);
        return;
      }

      toast.success('Products added successfully');
      form.reset({
        products: [emptyProduct],
      });
    } catch (error) {
      toast.error('Failed to add products');
      console.error(error);
    }
  }

  const addNewProduct = () => {
    append(emptyProduct);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((field, index) => (
          <Card key={field.id} className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Product {index + 1}</h3>
                {fields.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Supplier */}
                <FormField
                  control={form.control}
                  name={`products.${index}.supplier`}
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

                {/* Bill Number */}
                <FormField
                  control={form.control}
                  name={`products.${index}.bill_number`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bill Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter bill number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Received Date */}
                <FormField
                  control={form.control}
                  name={`products.${index}.received_date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Received Date</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="DD/MM/YYYY"
                          onChange={(e) => {
                            const formattedValue = formatDateInput(
                              e.target.value,
                            );
                            field.onChange(formattedValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Manufacturer */}
                <FormField
                  control={form.control}
                  name={`products.${index}.manufacturer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacturer</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter manufacturer name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Medicine Name */}
                <FormField
                  control={form.control}
                  name={`products.${index}.medicine_name`}
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

                {/* Barcode */}
                <FormField
                  control={form.control}
                  name={`products.${index}.barcode`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter barcode" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Pack Type */}
                <FormField
                  control={form.control}
                  name={`products.${index}.pack`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pack Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pack type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(PackTypeDisplay).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Quantity Per Pack */}
                <FormField
                  control={form.control}
                  name={`products.${index}.quantity_per_pack`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity Per Pack</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Batch Code */}
                <FormField
                  control={form.control}
                  name={`products.${index}.batch_code`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter batch code" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Expiry Date */}
                <FormField
                  control={form.control}
                  name={`products.${index}.expiry_date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="DD/MM/YYYY"
                          onChange={(e) => {
                            const formattedValue = formatDateInput(
                              e.target.value,
                            );
                            field.onChange(formattedValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Quantity */}
                <FormField
                  control={form.control}
                  name={`products.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Full Quantity */}
                <FormField
                  control={form.control}
                  name={`products.${index}.f_qty`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Quantity</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Half Quantity */}
                <FormField
                  control={form.control}
                  name={`products.${index}.half_qty`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Half Quantity</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* HSN Code */}
                <FormField
                  control={form.control}
                  name={`products.${index}.hsn_code`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HSN Code</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              fetchHsnCode(e.target.value, index);
                            }}
                            placeholder="Enter HSN Code"
                          />
                          {isLoadingGst[index] && (
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

                {/* Purchase Rate */}
                <FormField
                  control={form.control}
                  name={`products.${index}.purchase_rate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Rate</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          step="0.01"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sale Rate */}
                <FormField
                  control={form.control}
                  name={`products.${index}.sale_rate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale Rate</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          step="0.01"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* MRP */}
                <FormField
                  control={form.control}
                  name={`products.${index}.mrp`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MRP</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          step="0.01"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Discount */}
                <FormField
                  control={form.control}
                  name={`products.${index}.discount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (%)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          max="100"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CGST */}
                <FormField
                  control={form.control}
                  name={`products.${index}.cgst`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CGST (%)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SGST */}
                <FormField
                  control={form.control}
                  name={`products.${index}.sgst`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SGST (%)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* IGST */}
                <FormField
                  control={form.control}
                  name={`products.${index}.igst`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IGST (%)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Additional VAT */}
                <FormField
                  control={form.control}
                  name={`products.${index}.additional_vat`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional VAT</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amount */}
                <FormField
                  control={form.control}
                  name={`products.${index}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          step="0.01"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Local Cent */}
                <FormField
                  control={form.control}
                  name={`products.${index}.local_cent`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local Cent</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SCM1 */}
                <FormField
                  control={form.control}
                  name={`products.${index}.scm1`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SCM1</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SCM2 */}
                <FormField
                  control={form.control}
                  name={`products.${index}.scm2`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SCM2</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SCM Percentage */}
                <FormField
                  control={form.control}
                  name={`products.${index}.scm_percentage`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SCM Percentage</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* TCS Percentage */}
                <FormField
                  control={form.control}
                  name={`products.${index}.tcs_percentage`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TCS Percentage</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* TCS Amount */}
                <FormField
                  control={form.control}
                  name={`products.${index}.tcs_amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TCS Amount</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          step="0.01"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PO Number */}
                <FormField
                  control={form.control}
                  name={`products.${index}.po_number`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PO Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter PO number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PO Date */}
                <FormField
                  control={form.control}
                  name={`products.${index}.po_date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PO Date</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="DD/MM/YYYY"
                          onChange={(e) => {
                            const formattedValue = formatDateInput(
                              e.target.value,
                            );
                            field.onChange(formattedValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={addNewProduct}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Another Product
          </Button>

          <Button type="submit">Submit All Products</Button>
        </div>
      </form>
    </Form>
  );
}

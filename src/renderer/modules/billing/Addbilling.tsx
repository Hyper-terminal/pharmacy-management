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
import { Billingschema } from './schema';
export default function Addbilling() {
  const form = useForm<z.infer<typeof Billingschema>>({
    resolver: zodResolver(Billingschema),
    defaultValues: {
      NAME: '',
      'MEDICINE ID': 0,
      'BATCH ID': 0,
      DATE: '',
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

  function onSubmit(values: z.infer<typeof Billingschema>) {
    console.log(values);
    window.electron.ipcRenderer.invoke('add-bill', '');
  }
  async function handelMedicinesearch(e: any) {
    const incoming_data: string = e.target.value;
    const result = await window.electron.ipcRenderer.invoke(
      'search-medicines',
      incoming_data,
    ); // Send fil
    console.log(result);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="NAME"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Name</FormLabel>
                <FormControl>
                  <Input {...field} onChange={(e) => handelMedicinesearch(e)} />
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
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="DATE"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                <FormLabel>Discount</FormLabel>
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
            name="TAX"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="QTY"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qty</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="FINAL PRICE"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Final Price</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Add bill</Button>
      </form>
    </Form>
  );
}

import { Button } from '@/src/renderer/components/ui/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/src/renderer/components/ui/Command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/renderer/components/ui/Popover';
import { TransformedMedicineDropDownData } from '@/src/renderer/types';
import { transformMedicineDropDownData } from '@/src/renderer/utils';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { toast } from 'sonner';

interface AddMedicineDropdownProps {
  onSelect: (medicine: TransformedMedicineDropDownData) => void;
  field: FieldValues;
}

export default function AddMedicineDropdown({
  onSelect,
  field,
}: AddMedicineDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [medicines, setMedicines] = useState<TransformedMedicineDropDownData[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsLoading(true);
        try {
          const result = await window.electron.ipcRenderer.invoke(
            'search-medicines',
            searchTerm,
          );
          const transformedData = transformMedicineDropDownData(result);
          console.log({ transformedData, result });
          setMedicines(transformedData);
        } catch (error) {
          toast.error('Failed to search medicine');
          setMedicines([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setMedicines([]);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full transition-colors hover:bg-accent/50"
        >
          <span className="truncate">
            {field.value?.name || 'Search medicines...'}
          </span>
          <span
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          >
            ▼
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type medicine name..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="border-none focus:ring-0"
          />
          <CommandList>
            <CommandEmpty className="py-6 text-sm text-center">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </div>
              ) : searchTerm.trim() ? (
                'No medicines found.'
              ) : (
                'Start typing to search...'
              )}
            </CommandEmpty>
            <CommandGroup>
              {medicines?.map((medicine) => (
                <CommandItem
                  key={medicine.id}
                  onSelect={() => {
                    onSelect(medicine);
                    setOpen(false);
                    field.onChange(medicine);
                    setSearchTerm('');
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col gap-1 py-1">
                    <span className="font-medium">{medicine.name}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-1.5 py-0.5 rounded-md bg-accent">
                        Batch: {medicine.nearestExpiryBatch.batch_id}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-accent">
                        Price: ₹
                        {Number(medicine.nearestExpiryBatch.mrp).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

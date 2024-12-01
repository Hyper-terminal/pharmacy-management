import { Badge } from '@/src/renderer/components/ui/Badge';
import { Button } from '@/src/renderer/components/ui/Button';
import { cn } from '@/src/renderer/lib/utils';
import { motion } from 'framer-motion';
import { MinusCircle, PillIcon, PlusCircle, Trash2 } from 'lucide-react';

interface BatchData {
  mrp: string;
  batch_id: string;
  expiry_date: string;
  manufacturer: string;
}

interface NearestExpiryBatch {
  mrp: string;
  batch_id: string;
  expiry_date: string;
  manufacturer: string;
}

interface BillItemProps {
  item: {
    id: string;
    NAME: {
      id: number;
      name: string;
      total_qty: string;
      batchData: BatchData[];
      nearestExpiryBatch: NearestExpiryBatch;
    };
    'MEDICINE ID': number;
    'BATCH ID': number;
    DATE: string;
    DISCOUNT: number;
    TAX: number;
    QTY: string;
    PRICE: number;
    'FINAL PRICE': number;
    'CUSTOMER NAME': string;
    'CUSTOMER PHONE': string;
    HSN: number;
  };
  onRemove: (id: string) => void;
  onUpdateQuantity: (name: string, newQuantity: number) => void;
  index: number;
}

export function BillItem({
  item,
  onRemove,
  onUpdateQuantity,
  index,
}: BillItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'group relative flex items-center gap-4 rounded-xl border',
        'bg-background/50 dark:bg-background/50',
        'hover:bg-accent/50 dark:hover:bg-accent/50',
        'border-border dark:border-border',
        'transition-all duration-200 ease-in-out',
      )}
    >
      <div className="flex items-center flex-1 gap-4 p-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="p-2.5 rounded-lg bg-primary/10 dark:bg-primary/20"
        >
          <PillIcon className="w-5 h-5 text-primary dark:text-primary" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <h4 className="text-base font-medium truncate text-foreground">
            {item?.NAME?.name}
          </h4>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="secondary" className="px-2 py-0.5 text-xs">
              SKU: {item.id}
            </Badge>
            <span className="text-sm text-green-600 dark:text-green-500">
              ₹{Number(item.PRICE)?.toFixed(2)} each
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/50 dark:bg-accent/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onUpdateQuantity(
                item?.NAME?.name,
                Math.max(1, Number(item.QTY) - 1),
              )
            }
            className="p-0 h-7 w-7 hover:bg-primary/10"
          >
            <MinusCircle className="w-4 h-4 text-primary" />
          </Button>
          <span className="w-12 text-base font-medium text-center tabular-nums text-foreground">
            {item.QTY}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onUpdateQuantity(item?.NAME?.name, Number(item.QTY) + 1)
            }
            className="p-0 h-7 w-7 hover:bg-primary/10"
          >
            <PlusCircle className="w-4 h-4 text-primary" />
          </Button>
        </div>

        <div className="text-right min-w-[100px]">
          <div className="text-lg font-semibold text-primary tabular-nums">
            ₹{item['FINAL PRICE']?.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
          className="w-8 h-8 p-0 ml-2 hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

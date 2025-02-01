import { Badge } from '@/src/renderer/components/ui/Badge';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRightIcon, ReceiptIcon, SparklesIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Bill {
  id: string;
  total: number;
  items: number;
  created_at: string;
  updated_at: string;
}

export default function RecentBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentBills = async () => {
      try {
        const recentBills =
          await window.electron.ipcRenderer.invoke('get-recent-bills');
        setBills((recentBills as Bill[]) || []);
      } catch (error) {
        console.error('Error fetching recent bills:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentBills();

    try {
      window.electron.ipcRenderer.on(
        'emit-recent-bills',
        (...args: unknown[]) => {
          setBills((args[0] as Bill[]) || []);
        },
      );
    } catch (error) {
      console.error('Error fetching recent bills:', error);
    }

    return () => {
      window.electron.ipcRenderer.removeAllListeners('emit-recent-bills');
    };
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 rounded animate-pulse" />
            <div className="w-2/3 h-3 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 my-6 border border-gray-200 shadow-sm rounded-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="flex items-center gap-2.5 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/40"
          >
            <SparklesIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          </motion.div>
          Recent Transactions
        </h3>
        <motion.button
          whileHover={{ scale: 1.02, x: 3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/billing-details')}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 transition-all rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/50 dark:hover:bg-blue-900/70 group"
        >
          View All
          <ChevronRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {bills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center p-8 text-center rounded-xl bg-gray-50 dark:bg-gray-900/70"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="p-4 bg-gray-100 rounded-full dark:bg-gray-800"
            >
              <ReceiptIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </motion.div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              No transactions recorded yet
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {bills.map((bill, index) => (
              <motion.div
                key={bill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01, x: 2 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/billing-details?id=${bill.id}`)}
                className="flex items-center justify-between p-4 transition-all bg-white border border-gray-100 cursor-pointer dark:bg-gray-800/80 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/80 hover:shadow-md group"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="p-2.5 bg-blue-50 dark:bg-blue-900/50 rounded-xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/70"
                  >
                    <ReceiptIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Transaction #{bill?.id}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(bill?.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/50 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/70"
                  >
                    {bill.items} items
                  </Badge>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    ₹{bill.total?.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

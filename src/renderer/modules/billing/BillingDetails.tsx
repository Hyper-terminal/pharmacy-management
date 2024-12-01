import { motion, AnimatePresence } from 'framer-motion';
import { ReceiptIcon, Search, Eye, CalendarIcon, ArrowLeftIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/src/renderer/components/ui/Input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/renderer/components/ui/Table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/renderer/components/ui/Dialog';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/src/renderer/components/ui/Card';
import { Badge } from '@/src/renderer/components/ui/Badge';
import { Button } from '@/src/renderer/components/ui/Button';

interface Bill {
  id: number;
  name: string;
  medicines_id: number;
  batch_id: number;
  quantity_sold: number;
  discount: number;
  tax: number;
  price: number;
  final_price: number;
  customer_name: string;
  customer_phone: string;
  doctor_name: string;
  doctor_phone: string;
  hsn_code: string | null;
  bill_no: string | null;
  created_at: string;
  updated_at: string;
}

export default function BillingDetails() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bills, setBills] = useState<Bill[]>([]);
  const [currentBill, setCurrentBill] = useState<Bill | null>(null);
  const [view, setView] = useState<'details' | 'history'>('history');

  const navigate = useNavigate();
  const { id } = useParams();

  const filteredBills = bills?.filter(bill => 
    bill.customer_name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    bill.id?.toString()?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  useEffect(() => {
    // Fetch all bills first
    window.electron.ipcRenderer.invoke('get-bills').then(setBills);
    
    // If ID exists, fetch specific bill and switch to details view
    if (id) {
      window.electron.ipcRenderer.invoke('get-bill', Number(id))
        .then(bill => {
          setCurrentBill(bill);
          setView('details');
        });
    }
  }, [id]);

  const CurrentBillView = () => {
    // If no current bill is selected, show a message
    if (!currentBill) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex items-center justify-center h-64"
        >
          <p className="text-lg text-muted-foreground">Please select a bill to view details</p>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-2xl font-bold">
              Bill #{currentBill.id}
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              <CalendarIcon className="w-3 h-3 mr-1" />
              {new Date(currentBill.created_at).toLocaleDateString()}
            </Badge>
          </CardHeader>
          <div className="grid gap-6 p-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="space-y-2">
                <p><span className="text-muted-foreground">Name:</span> {currentBill.customer_name}</p>
                <p><span className="text-muted-foreground">Phone:</span> {currentBill.customer_phone}</p>
                <p><span className="text-muted-foreground">Doctor:</span> {currentBill.doctor_name}</p>
                <p><span className="text-muted-foreground">Doctor Phone:</span> {currentBill.doctor_phone}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Bill Summary</h3>
              <div className="space-y-3">
                <motion.div
                  key={currentBill.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-between p-3 rounded-lg bg-accent/50"
                >
                  <div>
                    <p className="font-medium">{currentBill.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {currentBill.quantity_sold} × ₹{currentBill.price}
                    </p>
                  </div>
                  <p className="font-semibold">₹{Number(currentBill.final_price).toFixed(2)}</p>
                </motion.div>
                
                <div className="pt-4 mt-4 border-t">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{Number(currentBill.final_price).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6 bg-gradient-to-b from-background to-background/50"
    >
      <div className="mx-auto space-y-6 max-w-7xl">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
            <div className="p-2 rounded-xl bg-primary/10">
              <ReceiptIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-primary to-purple-600 bg-clip-text">
                Billing Details
              </h1>
              <p className="text-sm text-muted-foreground">
                View and manage billing information
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={view === 'details' ? 'default' : 'outline'}
              onClick={() => setView('details')}
              disabled={!currentBill}
            >
              Current Bill
            </Button>
            <Button
              variant={view === 'history' ? 'default' : 'outline'}
              onClick={() => setView('history')}
            >
              History
            </Button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {view === 'details' ? (
            <CurrentBillView />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="relative">
                <Search className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search bills by ID or customer name..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{bill.id}</TableCell>
                        <TableCell>{new Date(bill.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{bill.customer_name}</TableCell>
                        <TableCell>₹{bill.final_price?.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCurrentBill(bill);
                              setView('details');
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
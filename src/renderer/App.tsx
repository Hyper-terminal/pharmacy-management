import MainLayout from '@/src/renderer/components/layout/MainLayout';
import AddProduct from '@/src/renderer/modules/add-product/AddProduct';
import Products from '@/src/renderer/modules/products/Products';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Batches from './modules/batches/Batches';
import BillingHomescreen from './modules/billing/BillingHomescreen';
import Expiring from './modules/expiring/Expiring';
import Setting from './modules/settings/Setting';
import BillingDetails from './modules/billing/BillingDetails';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Products />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="billing" element={<BillingHomescreen />} />
          <Route path="settings" element={<Setting />} />
          <Route path="batches" element={<Batches />} />
          <Route path="expiring" element={<Expiring />} />
          <Route path="billing-details" element={<BillingDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

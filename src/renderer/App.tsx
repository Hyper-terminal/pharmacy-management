import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainLayout from '@/src/renderer/components/layout/MainLayout';
import Products from '@/src/renderer/modules/products/Products';
import AddProduct from "@/src/renderer/modules/add-product/AddProduct";
import Billing from './modules/billing/Billing';
import Setting from './modules/settings/Setting';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Products />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Setting />} />
        </Route>
      </Routes>
    </Router>
  );
}

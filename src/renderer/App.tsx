import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainLayout from '@/src/renderer/components/layout/MainLayout';
import Products from '@/src/renderer/modules/products/Products';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Products />} />
        </Route>
      </Routes>
    </Router>
  );
}

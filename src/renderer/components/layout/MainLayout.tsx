import AppSidebar from '@/src/renderer/components/AppSidebar';
import { ThemeProvider } from '@/src/renderer/components/ThemeProvider';
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/src/renderer/components/ui/Sidebar';
import { Outlet } from 'react-router-dom';
import { Toaster } from '../ui/Toaster';

export default function MainLayout() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full p-4 overflow-hidden">
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarProvider>
      <Toaster position="top-center"/>
    </ThemeProvider>
  );
}

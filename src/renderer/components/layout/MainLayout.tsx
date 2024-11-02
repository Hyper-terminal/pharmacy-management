import {
  SidebarProvider,
  SidebarTrigger,
} from '@/src/renderer/components/ui/Sidebar';
import AppSidebar from '@/src/renderer/components/AppSidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';
import {ThemeProvider} from '@/src/renderer/components/ThemeProvider';

export default function MainLayout() {
  return (
    <ThemeProvider>
    <SidebarProvider>
      <AppSidebar />
      <>
        <SidebarTrigger />
        <Outlet />
      </>
    </SidebarProvider>
    </ThemeProvider>
  );
}

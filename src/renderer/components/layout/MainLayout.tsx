import {
  SidebarProvider,
  SidebarTrigger,
} from '@/src/renderer/components/ui/Sidebar';
import AppSidebar from '@/src/renderer/components/AppSidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <>
        <SidebarTrigger />

        <Outlet />
      </>
    </SidebarProvider>
  );
}

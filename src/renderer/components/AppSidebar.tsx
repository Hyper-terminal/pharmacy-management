import { Package2, PlusCircle, Receipt, Settings, Package2Icon } from 'lucide-react';

import { ThemeToggle } from '@/src/renderer/components/container/ThemeToggle';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/src/renderer/components/ui/Sidebar';
import { Link, useLocation } from 'react-router-dom';

// Menu items.
const items = [
  {
    title: 'Products',
    url: '/',
    icon: Package2,
  },
  {
    title: 'Add Product',
    url: '/add-product',
    icon: PlusCircle,
  },
  {
    title: 'Billing',
    url: '/billing',
    icon: Receipt,
  },
  {
    title: 'Batches',
    url: '/batches',
    icon: Package2Icon,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

export default function AppSidebar() {
  const location = useLocation();

  // get active item based on the url
  const activeItem = items.find((item) => item.url === location.pathname) || items[0];

  return (
    <Sidebar className="p-4">
      <SidebarHeader>
        <ThemeToggle />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  className={`rounded-lg ${
                    activeItem.title === item.title
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent/5'
                  } transition-colors duration-200`}
                  key={item.title}
                >
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

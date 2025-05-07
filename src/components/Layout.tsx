
import React, { useState } from 'react';
import { AppHeader } from './AppHeader';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';
import { Home, ClipboardList, Users, User, BellRing, Plus, Menu } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  const navigationItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: ClipboardList, label: "Tarefas", path: "/tasks" },
    { icon: Users, label: "Equipe", path: "/team" },
    { icon: User, label: "Meu Perfil", path: "/profile" },
    { icon: BellRing, label: "Alertas", path: "/alerts" },
    { icon: Plus, label: "Nova Tarefa", path: "/tasks/create" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        {/* Desktop Sidebar */}
        <Sidebar>
          <SidebarContent>
            <div className="p-4">
              <h2 className="text-xl font-bold text-task-blue">Task Twin</h2>
              <p className="text-xs text-gray-500">Sistema de Gestão de Tarefas</p>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton onClick={() => navigate(item.path)}>
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <AppHeader />
          
          {/* Mobile Hamburger Menu */}
          <div className="md:hidden fixed bottom-4 right-4 z-50">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button size="icon" className="rounded-full shadow-lg bg-task-blue hover:bg-task-blue/90">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh]">
                <div className="py-4">
                  <h3 className="text-xl font-bold mb-4 text-task-blue text-center">Task Twin</h3>
                  <div className="space-y-2">
                    {navigationItems.map((item) => (
                      <Button
                        key={item.path}
                        variant="ghost"
                        className="w-full justify-start text-left"
                        onClick={() => handleNavigation(item.path)}
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

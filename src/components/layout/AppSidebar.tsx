import { FileText, Users, Calendar } from "lucide-react";
import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.jpg";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Transaksi", url: "/", icon: FileText, adminOnly: false },
  { title: "Data Worker", url: "/workers", icon: Users, adminOnly: true },
  { title: "Jadwal Order Mitra", url: "/orders", icon: Calendar, adminOnly: false },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const collapsed = state === "collapsed";

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon">
      {!collapsed && (
        <SidebarHeader className="border-b border-border p-4">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Pembimbingmu"
              className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">Pembimbingmu</span>
              <span className="text-xs text-muted-foreground">Rekap Jasa Tugasmu</span>
            </div>
          </div>
        </SidebarHeader>
      )}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
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

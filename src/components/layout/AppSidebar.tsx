import { FileText, Users, Calendar, BarChart3, Building2, Coins, UserPlus } from "lucide-react";
import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.jpg";

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
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

type UserRole = 'admin' | 'franchise' | 'public';

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const mainMenuItems: MenuItem[] = [
  { title: "Laporan Keuangan", url: "/laporan", icon: BarChart3, roles: ['admin'] },
  { title: "Pencatatan Keuangan", url: "/", icon: FileText, roles: ['admin'] },
  { title: "Data Worker", url: "/workers", icon: Users, roles: ['admin'] },
  { title: "Kelola User", url: "/kelola-user", icon: UserPlus, roles: ['admin'] },
  { title: "Jadwal Order Mitra", url: "/orders", icon: Calendar, roles: ['public'] },
];

const franchiseMenuItems: MenuItem[] = [
  { title: "Daftar Franchise", url: "/franchise", icon: Building2, roles: ['admin'] },
  { title: "Keuangan Franchise", url: "/franchise-finance", icon: Coins, roles: ['admin', 'franchise'] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { isAdmin, isFranchise } = useAuth();
  const collapsed = state === "collapsed";

  // Filter menu items based on user role
  const filterByRole = (items: MenuItem[]) => {
    return items.filter(item => {
      if (isAdmin && item.roles.includes('admin')) return true;
      if (isFranchise && item.roles.includes('franchise')) return true;
      if (item.roles.includes('public')) return true; // Show to everyone including non-logged-in users
      return false;
    });
  };

  const visibleMainItems = filterByRole(mainMenuItems);
  const visibleFranchiseItems = filterByRole(franchiseMenuItems);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const renderMenuItems = (items: MenuItem[]) => (
    <SidebarMenu>
      {items.map((item) => (
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
  );

  return (
    <Sidebar collapsible="offcanvas">
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
            {renderMenuItems(visibleMainItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {visibleFranchiseItems.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs text-muted-foreground px-3">
                Franchise
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {renderMenuItems(visibleFranchiseItems)}
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

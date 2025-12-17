import { FileText, Users, Calendar, BarChart3, Building2, ClipboardList, Coins } from "lucide-react";
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

const mainMenuItems = [
  { title: "Laporan Keuangan", url: "/laporan", icon: BarChart3, adminOnly: true },
  { title: "Pencatatan Keuangan", url: "/", icon: FileText, adminOnly: true },
  { title: "Data Worker", url: "/workers", icon: Users, adminOnly: true },
  { title: "Jadwal Order Mitra", url: "/orders", icon: Calendar, adminOnly: false },
];

const franchiseMenuItems = [
  { title: "Daftar Franchise", url: "/franchise", icon: Building2, adminOnly: true },
  { title: "Pencatatan Order Franchise", url: "/franchise-orders", icon: ClipboardList, adminOnly: false },
  { title: "Keuangan Franchise", url: "/franchise-finance", icon: Coins, adminOnly: false },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const collapsed = state === "collapsed";

  // Filter menu items based on user role
  const visibleMainItems = mainMenuItems.filter(item => !item.adminOnly || isAdmin);
  const visibleFranchiseItems = franchiseMenuItems.filter(item => !item.adminOnly || isAdmin);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const renderMenuItems = (items: typeof mainMenuItems) => (
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

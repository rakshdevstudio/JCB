import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Building2,
  MapPin,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCog,
  Tag,
  Globe,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export const AdminSidebar = () => {
  const location = useLocation();
  const { profile, isSuperAdmin, isCityManager, isSalonManager, isStaff, signOut } = useAuth();
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  // Define menu items based on role
  const mainMenuItems = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard, roles: ["all"] },
    { title: "Bookings", url: "/admin/bookings", icon: Calendar, roles: ["all"] },
  ];

  const managementItems = [
    { title: "Staff", url: "/admin/staff", icon: Users, roles: ["super_admin", "city_manager", "salon_manager"] },
    { title: "Services", url: "/admin/services", icon: Scissors, roles: ["super_admin", "city_manager", "salon_manager"] },
    { title: "Salons", url: "/admin/salons", icon: Building2, roles: ["super_admin", "city_manager"] },
    { title: "Offers", url: "/admin/offers", icon: Tag, roles: ["super_admin"] },
    { title: "Cities", url: "/admin/cities", icon: MapPin, roles: ["super_admin"] },
    { title: "User Roles", url: "/admin/roles", icon: UserCog, roles: ["super_admin"] },
  ];

  const hasAccess = (roles: string[]) => {
    if (roles.includes("all")) return true;
    if (roles.includes("super_admin") && isSuperAdmin) return true;
    if (roles.includes("city_manager") && (isSuperAdmin || isCityManager)) return true;
    if (roles.includes("salon_manager") && (isSuperAdmin || isCityManager || isSalonManager)) return true;
    if (roles.includes("staff") && (isSuperAdmin || isCityManager || isSalonManager || isStaff)) return true;
    return false;
  };

  const filteredManagementItems = managementItems.filter((item) => hasAccess(item.roles));

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card">
      <SidebarHeader className={cn("border-b border-border", collapsed ? "p-2" : "p-4")}>
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && (
            <Link to="/admin" className="flex flex-col">
              <span className="text-lg font-serif text-foreground">JCB Admin</span>
              <span className="text-xs text-muted-foreground">Salon Management</span>
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-xs text-muted-foreground mb-2">Main</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                        isActive(item.url)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {filteredManagementItems.length > 0 && (
          <SidebarGroup className="mt-6">
            {!collapsed && <SidebarGroupLabel className="text-xs text-muted-foreground mb-2">Management</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredManagementItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                          isActive(item.url)
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup className="mt-6">
          {!collapsed && <SidebarGroupLabel className="text-xs text-muted-foreground mb-2">Settings</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/admin/settings"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      isActive("/admin/settings")
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Settings className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span>Settings</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full mb-2",
            "text-muted-foreground hover:bg-primary/10 hover:text-primary group"
          )}
        >
          <Globe className="w-5 h-5 flex-shrink-0 transition-transform group-hover:rotate-12" />
          {!collapsed && <span>Back to Website</span>}
        </Link>
        {!collapsed && profile && (
          <div className="mb-3">
            <p className="text-sm font-medium text-foreground truncate">
              {profile.full_name || profile.email}
            </p>
            <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
          </div>
        )}
        <button
          onClick={signOut}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full",
            "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

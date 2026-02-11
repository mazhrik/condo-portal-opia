import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  FileText,
  Bell,
  Box,
  Vote,
  ShieldAlert,
  Calendar,
  Ban,
  Building,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Communication Hub",
    url: "/admin/communication",
    icon: MessageSquare,
  },
  {
    title: "Documents",
    url: "/admin/documents",
    icon: FileText,
  },
  {
    title: "Announcements",
    url: "/admin/announcements",
    icon: Bell,
  },
  {
    title: "Packages",
    url: "/admin/packages",
    icon: Box,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Polls",
    url: "/admin/polls",
    icon: Vote,
  },
  {
    title: "Incidents",
    url: "/admin/incidents",
    icon: ShieldAlert,
  },
  {
    title: "Violations",
    url: "/admin/violations",
    icon: Ban,
  },
  {
    title: "Events",
    url: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Amenities",
    url: "/admin/amenities",
    icon: Building,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-2 p-2 rounded-md hover:bg-white/10 text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors w-full">
                      <item.icon className="h-4 w-4" />
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
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
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Bell,
  Calendar,
  Building,
  CreditCard,
  MessageSquare,
  Car,
  Users,
  FileText,
  Box,
  Vote,
  ShieldAlert,
  CalendarDays,
  Hammer,
  Ban,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/resident",
    icon: LayoutDashboard,
  },
  {
    title: "Announcements",
    url: "/resident/announcements",
    icon: Bell,
  },
  {
    title: "Maintenance",
    url: "/resident/maintenance",
    icon: Building,
  },
  {
    title: "ARC Requests",
    url: "/resident/arc",
    icon: Hammer,
  },
  {
    title: "My Violations",
    url: "/resident/violations",
    icon: Ban,
  },
  {
    title: "Amenity Bookings",
    url: "/resident/amenities",
    icon: Calendar,
  },
  {
    title: "Payments",
    url: "/resident/payments",
    icon: CreditCard,
  },
  {
    title: "Parking",
    url: "/resident/parking",
    icon: Car,
  },
  {
    title: "Documents",
    url: "/resident/documents",
    icon: FileText,
  },
  {
    title: "Community",
    url: "/resident/community",
    icon: Users,
  },
  {
    title: "Packages",
    url: "/resident/packages",
    icon: Box,
  },
  {
    title: "Messages",
    url: "/resident/messages",
    icon: MessageSquare,
  },
  {
    title: "Polls",
    url: "/resident/polls",
    icon: Vote,
  },
  {
    title: "Incidents",
    url: "/resident/incidents",
    icon: ShieldAlert,
  },
  {
    title: "Events",
    url: "/resident/events",
    icon: CalendarDays,
  },
];

export function ResidentSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Resident Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-2">
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
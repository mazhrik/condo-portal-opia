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
    FileText,
    DollarSign,
    Vote,
    Settings,
} from "lucide-react";

const menuItems = [
    {
        title: "Dashboard",
        url: "/board",
        icon: LayoutDashboard,
    },
    {
        title: "ARC Reviews",
        url: "/board/arc",
        icon: FileText,
    },
    {
        title: "Financial Reports",
        url: "/board/financials",
        icon: DollarSign,
    },
    {
        title: "Board Polls",
        url: "/board/polls",
        icon: Vote,
    },
    {
        title: "Settings",
        url: "/board/settings",
        icon: Settings,
    },
];

export function BoardSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Board Portal</SidebarGroupLabel>
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

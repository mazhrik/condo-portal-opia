
import { NavLink } from "react-router-dom";
import { Bell, Home, Users, BarChart, FileText, Settings } from "lucide-react";

export const AdminSidebar = () => (
    <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <NavLink to="/admin" className="flex items-center gap-2 font-semibold">
                <BarChart className="h-6 w-6" />
                <span>Admin Dashboard</span>
            </NavLink>
        </div>
        <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <NavLink to="/admin/residents" className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : ''}`}>
                    <Users className="h-4 w-4" />
                    Residents
                </NavLink>
                <NavLink to="/admin/announcements" className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : ''}`}>
                    <Bell className="h-4 w-4" />
                    Announcements
                </NavLink>
                <NavLink to="/admin/maintenance-requests" className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : ''}`}>
                    <Home className="h-4 w-4" />
                    Maintenance
                </NavLink>
                <NavLink to="/admin/documents" className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : ''}`}>
                    <FileText className="h-4 w-4" />
                    Documents
                </NavLink>
                 <NavLink to="/admin/settings" className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : ''}`}>
                    <Settings className="h-4 w-4" />
                    Settings
                </NavLink>
            </nav>
        </div>
    </div>
);

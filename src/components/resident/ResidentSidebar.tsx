
import { NavLink } from "react-router-dom";
import { Home, Bell, Wrench, Building, Users, FileText, Vote } from "lucide-react";

export const ResidentSidebar = () => (
    <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <NavLink to="/dashboard" className="flex items-center gap-2 font-semibold">
                <Home className="h-6 w-6" />
                <span>Resident Portal</span>
            </NavLink>
        </div>
        <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <NavLink to="/dashboard" end className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : ''}`}>
                    <Home className="h-4 w-4" />
                    Dashboard
                </NavLink>
                <NavLink to="/announcements" className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : ''}`}>
                    <Bell className="h-4 w-4" />
                    Announcements
                </NavLink>
                <NavLink to="/maintenance" className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : ''}`}>
                    <Wrench className="h-4 w-4" />
                    Maintenance
                </NavLink>
                <NavLink to="/resident/amenities" className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : ''}`}>
                    <Building className="h-4 w-4" />
                    Amenities
                </NavLink>
                <NavLink to="/resident/arc" className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : ''}`}>
                    <FileText className="h-4 w-4" />
                    ARC Requests
                </NavLink>
                <NavLink to="/resident/violations" className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : ''}`}>
                    <Users className="h-4 w-4" />
                    My Violations
                </NavLink>
                 <NavLink to="/resident/polls" className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : ''}`}>
                    <Vote className="h-4 w-4" />
                    Polls
                </NavLink>
            </nav>
        </div>
    </div>
);

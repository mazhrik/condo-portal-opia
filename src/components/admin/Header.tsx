
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BarChart, Users, Bell, Home, FileText, Settings, Wrench, Building, Vote, ClipboardList, Banknote } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMe } from "@/hooks/useMe";

export const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { data: me } = useMe();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderMobileNav = () => {
    if (me?.role === "admin" || me?.role === "manager") {
      return (
          <nav className="grid gap-2 text-lg font-medium">
            <NavLink to="/admin" className="flex items-center gap-2 text-lg font-semibold">
              <BarChart className="h-6 w-6" />
              <span className="sr-only">Admin Dashboard</span>
            </NavLink>
            <NavLink to="/admin/residents" className="hover:text-foreground">
              Residents
            </NavLink>
            <NavLink to="/admin/announcements" className="text-muted-foreground hover:text-foreground">
              Announcements
            </NavLink>
            <NavLink to="/admin/maintenance-requests" className="text-muted-foreground hover:text-foreground">
              Maintenance
            </NavLink>
            <NavLink to="/admin/documents" className="text-muted-foreground hover:text-foreground">
              Documents
            </NavLink>
            <NavLink to="/admin/settings" className="text-muted-foreground hover:text-foreground">
              Settings
            </NavLink>
        </nav>
      )
    }
    if (me?.resident?.is_board_member) {
      return (
         <nav className="grid gap-2 text-lg font-medium">
            <NavLink to="/board" className="flex items-center gap-2 text-lg font-semibold">
              <Home className="h-6 w-6" />
              <span className="sr-only">Board Portal</span>
            </NavLink>
            <NavLink to="/board/arc" className="text-muted-foreground hover:text-foreground">
              Architectural Reviews
            </NavLink>
            <NavLink to="/board/financials" className="text-muted-foreground hover:text-foreground">
              Financial Reports
            </NavLink>
            <NavLink to="/board/polls" className="text-muted-foreground hover:text-foreground">
              Polls
            </NavLink>
            <NavLink to="/board/settings" className="text-muted-foreground hover:text-foreground">
              Settings
            </NavLink>
        </nav>
      )
    }
    if (me?.role === "resident") {
      return (
        <nav className="grid gap-2 text-lg font-medium">
            <NavLink to="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
              <Home className="h-6 w-6" />
              <span className="sr-only">Resident Portal</span>
            </NavLink>
            <NavLink to="/dashboard" end className="hover:text-foreground">
                Dashboard
            </NavLink>
            <NavLink to="/announcements" className="text-muted-foreground hover:text-foreground">
                Announcements
            </NavLink>
            <NavLink to="/maintenance" className="text-muted-foreground hover:text-foreground">
                Maintenance
            </NavLink>
            <NavLink to="/resident/amenities" className="text-muted-foreground hover:text-foreground">
                Amenities
            </NavLink>
            <NavLink to="/resident/arc" className="text-muted-foreground hover:text-foreground">
                ARC Requests
            </NavLink>
            <NavLink to="/resident/violations" className="text-muted-foreground hover:text-foreground">
                My Violations
            </NavLink>
            <NavLink to="/resident/polls" className="text-muted-foreground hover:text-foreground">
                Polls
            </NavLink>
        </nav>
      )
    }
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          {renderMobileNav()}
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        {/* Add breadcrumbs or other header content here */}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right text-xs text-muted-foreground">
          <div className="text-sm font-semibold text-foreground">
            {me?.first_name ? `${me.first_name} ${me.last_name}`.trim() : "Signed in"}
          </div>
          <div className="uppercase tracking-wide">{me?.role ?? "role pending"}</div>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </header>
  );
};

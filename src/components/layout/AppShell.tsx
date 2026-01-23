import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/useMe";

const AppShell = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { data: me } = useMe();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-900/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-lg font-semibold">
              Condo Portal
            </Link>
            <nav className="hidden items-center gap-4 text-sm text-white/70 md:flex">
              <Link to="/dashboard" className="hover:text-white">
                Home
              </Link>
              <Link to="/announcements" className="hover:text-white">
                Announcements
              </Link>
              <Link to="/maintenance" className="hover:text-white">
                Maintenance
              </Link>
              {me?.role === "admin" || me?.role === "manager" ? (
                <Link to="/maintenance/all" className="hover:text-white">
                  All Requests
                </Link>
              ) : null}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-xs text-white/70">
              <div className="text-sm font-semibold text-white">
                {me?.first_name ? `${me.first_name} ${me.last_name}`.trim() : "Signed in"}
              </div>
              <div className="uppercase tracking-wide">{me?.role ?? "role pending"}</div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;

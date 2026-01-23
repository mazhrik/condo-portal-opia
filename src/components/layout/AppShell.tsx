import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const AppShell = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-900/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-semibold">
              Condo Portal
            </Link>
            <nav className="hidden items-center gap-4 text-sm text-white/70 md:flex">
              <Link to="/" className="hover:text-white">
                Home
              </Link>
              <span className="rounded-full border border-dashed border-white/30 px-3 py-1 text-xs text-white/50">
                Navigation placeholder
              </span>
            </nav>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;

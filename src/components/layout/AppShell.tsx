
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ResidentSidebar } from "@/components/resident/ResidentSidebar";
import { BoardSidebar } from "@/components/board/BoardSidebar";
import { useMe } from "@/hooks/useMe";
import { Header } from "@/components/admin/Header";
import { cn } from "@/lib/utils";

const AppShell = () => {
  const { data: me } = useMe();
  const role = me?.role;

  const renderSidebar = () => {
    if (role === "admin" || role === "manager") {
      return <AdminSidebar />;
    }
    if (me?.resident?.is_board_member) {
      return <BoardSidebar />;
    }
    if (role === "resident") {
      return <ResidentSidebar />;
    }
    return null;
  };

  return (
    <div className={cn("min-h-screen w-full bg-background text-foreground")}>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
            {renderSidebar()}
        </div>
        <div className="flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto bg-muted/40 p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppShell;

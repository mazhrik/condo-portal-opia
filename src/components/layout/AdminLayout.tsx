import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                <AdminSidebar />
                <main className="flex-1 overflow-y-auto w-full">
                    <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background px-4 justify-between">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger />
                            <span className="font-semibold">Admin Portal</span>
                        </div>
                    </header>
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
};

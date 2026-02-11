import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ResidentSidebar } from "./ResidentSidebar";

interface ResidentLayoutProps {
    children: React.ReactNode;
}

import { NotificationBell } from "./NotificationBell";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const ResidentLayout: React.FC<ResidentLayoutProps> = ({ children }) => {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                <ResidentSidebar />
                <main className="flex-1 overflow-y-auto w-full">
                    <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background px-4 justify-between">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger />
                        </div>
                        <div className="flex items-center gap-2">
                            <NotificationBell />
                        </div>
                    </header>
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
};

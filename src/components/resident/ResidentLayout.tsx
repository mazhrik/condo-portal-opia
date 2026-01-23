import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ResidentSidebar } from "./ResidentSidebar";

interface ResidentLayoutProps {
    children: React.ReactNode;
}

export const ResidentLayout: React.FC<ResidentLayoutProps> = ({ children }) => {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                <ResidentSidebar />
                <main className="flex-1 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
};

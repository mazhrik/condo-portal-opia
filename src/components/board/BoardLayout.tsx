import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BoardSidebar } from "./BoardSidebar";

interface BoardLayoutProps {
    children: React.ReactNode;
}

export const BoardLayout: React.FC<BoardLayoutProps> = ({ children }) => {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                <BoardSidebar />
                <main className="flex-1 overflow-y-auto w-full">
                    <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background px-4 justify-between">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger />
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Add Board Notifications if needed later */}
                            <span className="text-sm font-medium">Board Access</span>
                        </div>
                    </header>
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
};

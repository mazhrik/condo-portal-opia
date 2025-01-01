import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import Header from "@/components/admin/Header";
import DashboardGrid from "@/components/admin/DashboardGrid";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-background/50">
        <div 
          className={`fixed md:static top-0 left-0 h-full bg-background border-r transition-transform duration-300 ease-in-out transform 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-50 shadow-lg`}
        >
          <AdminSidebar />
        </div>
        <div className="flex-1 p-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="fixed top-4 left-4 z-50 md:hidden hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="fixed inset-0 -z-10">
            <img
              src="https://images.unsplash.com/photo-1554995207-c18c203602cb"
              alt="Modern interior"
              className="w-full h-full object-cover opacity-[0.03]"
            />
          </div>
          <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background to-background/50" />
          <div className="relative max-w-7xl mx-auto space-y-8">
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              <div className="col-span-1 md:col-span-2 xl:col-span-3 p-6 rounded-lg glass">
                <div className="flex gap-6 overflow-x-auto pb-4">
                  <img
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"
                    alt="Modern apartment"
                    className="w-64 h-40 rounded-lg object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
                    alt="Luxury building"
                    className="w-64 h-40 rounded-lg object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
                    alt="Corporate building"
                    className="w-64 h-40 rounded-lg object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"
                    alt="Modern interior"
                    className="w-64 h-40 rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
            <DashboardGrid />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
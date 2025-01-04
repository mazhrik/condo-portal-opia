import { SidebarProvider } from "@/components/ui/sidebar";
import { ResidentSidebar } from "@/components/resident/ResidentSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import MaintenanceCard from "@/components/resident/dashboard/MaintenanceCard";
import AmenityCard from "@/components/resident/dashboard/AmenityCard";
import PaymentCard from "@/components/resident/dashboard/PaymentCard";
import ParkingCard from "@/components/resident/dashboard/ParkingCard";
import CommunityCard from "@/components/resident/dashboard/CommunityCard";
import LocalServices from "@/components/resident/LocalServices";

const ResidentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-primary-100">
        <div 
          className={`fixed md:static top-0 left-0 h-full bg-background border-r transition-transform duration-300 ease-in-out transform 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-50 shadow-lg`}
        >
          <ResidentSidebar />
        </div>
        <div className="flex-1 p-8 relative">
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

          {/* Background Image */}
          <div className="fixed inset-0 -z-10">
            <div 
              className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750')] 
              bg-cover bg-center bg-fixed opacity-[0.03]"
            ></div>
            <div className="absolute inset-0 bg-gradient-to-br from-background to-background/50"></div>
          </div>

          <div className="max-w-7xl mx-auto space-y-8 relative z-10">
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-primary">Welcome, John Doe</h1>
                <p className="text-gray-600">Unit 501 • Building A</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline">My Profile</Button>
                <Button variant="outline" onClick={() => window.location.href = "/"}>
                  Logout
                </Button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MaintenanceCard />
              <AmenityCard />
              <PaymentCard />
              <ParkingCard />
              <CommunityCard />
            </div>

            <LocalServices />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ResidentDashboard;
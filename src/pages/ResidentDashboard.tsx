import { ResidentLayout } from "@/components/resident/ResidentLayout";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import MaintenanceCard from "@/components/resident/dashboard/MaintenanceCard";
import AmenityCard from "@/components/resident/dashboard/AmenityCard";
import PaymentCard from "@/components/resident/dashboard/PaymentCard";
import ParkingCard from "@/components/resident/dashboard/ParkingCard";
import CommunityCard from "@/components/resident/dashboard/CommunityCard";
import LocalServices from "@/components/resident/LocalServices";

const ResidentDashboard = () => {
  return (
    <ResidentLayout>
      <div className="p-8 relative">
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
    </ResidentLayout>
  );
};

export default ResidentDashboard;
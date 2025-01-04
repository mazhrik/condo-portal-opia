import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Building } from "lucide-react";
import DashboardCard from "./DashboardCard";

const MaintenanceCard = () => {
  const navigate = useNavigate();

  return (
    <DashboardCard icon={Building} title="Maintenance Requests">
      <div className="space-y-2">
        <p className="text-sm font-medium">Active Requests: 2</p>
        <Button 
          className="w-full"
          onClick={() => navigate("/resident/maintenance")}
        >
          Submit New Request
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate("/resident/maintenance")}
        >
          View History
        </Button>
      </div>
    </DashboardCard>
  );
};

export default MaintenanceCard;
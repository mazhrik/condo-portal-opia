import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Car } from "lucide-react";
import DashboardCard from "./DashboardCard";

const ParkingCard = () => {
  const navigate = useNavigate();

  return (
    <DashboardCard icon={Car} title="Parking">
      <div>
        <p className="text-sm font-medium">Your Spot: B2-45</p>
        <p className="text-sm text-gray-600">Visitor Passes: 2 Available</p>
        <Button 
          className="w-full mt-2"
          onClick={() => navigate("/resident/parking")}
        >
          Request Visitor Pass
        </Button>
      </div>
    </DashboardCard>
  );
};

export default ParkingCard;
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import DashboardCard from "./DashboardCard";

const AmenityCard = () => {
  const navigate = useNavigate();

  return (
    <DashboardCard icon={Calendar} title="Amenity Bookings">
      <div className="space-y-2">
        <p className="text-sm font-medium">Your Upcoming Bookings</p>
        <div className="text-sm text-gray-600">
          <p>Gym - Today, 6 PM</p>
          <p>Pool - Tomorrow, 2 PM</p>
        </div>
        <Button 
          className="w-full"
          onClick={() => navigate("/resident/amenities")}
        >
          Book Amenity
        </Button>
      </div>
    </DashboardCard>
  );
};

export default AmenityCard;
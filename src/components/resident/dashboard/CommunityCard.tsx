import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import DashboardCard from "./DashboardCard";

const CommunityCard = () => {
  const navigate = useNavigate();

  return (
    <DashboardCard icon={Users} title="Community">
      <Button 
        className="w-full"
        onClick={() => navigate("/resident/community")}
      >
        View Directory
      </Button>
    </DashboardCard>
  );
};

export default CommunityCard;
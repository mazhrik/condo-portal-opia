import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import DashboardCard from "./DashboardCard";

const PaymentCard = () => {
  const navigate = useNavigate();

  return (
    <DashboardCard icon={CreditCard} title="Payments">
      <div>
        <p className="text-sm font-medium">Next Payment Due</p>
        <p className="text-2xl font-bold text-primary">$1,500</p>
        <p className="text-sm text-gray-600">Due: May 1, 2024</p>
        <Button 
          className="w-full mt-4"
          onClick={() => navigate("/resident/payments")}
        >
          Make Payment
        </Button>
      </div>
    </DashboardCard>
  );
};

export default PaymentCard;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}

const DashboardCard = ({ icon: Icon, title, children }: DashboardCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Icon className="w-8 h-8 text-primary" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default DashboardCard;
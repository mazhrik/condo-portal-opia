import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  icon: LucideIcon;
  title: string;
  stats?: {
    value: string | number;
    label: string;
  };
  actions: {
    primary?: string;
    secondary?: string;
  };
}

const DashboardCard = ({ icon: Icon, title, stats, actions }: DashboardCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Icon className="w-8 h-8 text-primary" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats && (
            <div>
              <div className="text-2xl font-bold">{stats.value}</div>
              <p className="text-sm text-gray-600">{stats.label}</p>
            </div>
          )}
          <div className="space-y-2">
            {actions.primary && (
              <Button className="w-full">{actions.primary}</Button>
            )}
            {actions.secondary && (
              <Button variant="outline" className="w-full">{actions.secondary}</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
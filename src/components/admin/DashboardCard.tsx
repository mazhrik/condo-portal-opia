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
    <Card className="backdrop-blur-sm bg-card/50 border-accent/10 hover:border-accent/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <CardHeader className="flex flex-row items-center space-x-4">
        <div className="p-2 rounded-full bg-primary/10">
          <Icon className="w-6 h-6 text-primary animate-float" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats && (
            <div className="animate-fade-in">
              <div className="text-2xl font-bold text-primary">{stats.value}</div>
              <p className="text-sm text-muted-foreground">{stats.label}</p>
            </div>
          )}
          <div className="space-y-2">
            {actions.primary && (
              <Button 
                className="w-full bg-primary/80 hover:bg-primary transition-colors duration-300"
              >
                {actions.primary}
              </Button>
            )}
            {actions.secondary && (
              <Button 
                variant="outline" 
                className="w-full border-primary/20 hover:border-primary/40 transition-colors duration-300"
              >
                {actions.secondary}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface DashboardCardProps {
  icon: LucideIcon;
  title: string;
  stats?: {
    value: string | number;
    label: string;
  };
  actions: {
    primary?: {
      label: string;
      route?: string;
      onClick?: () => void;
    };
    secondary?: {
      label: string;
      route?: string;
      onClick?: () => void;
    };
  };
}

const DashboardCard = ({ icon: Icon, title, stats, actions }: DashboardCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAction = (action: { route?: string; onClick?: () => void; label: string }) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.route) {
      navigate(action.route);
    } else {
      toast({
        title: "Action not implemented",
        description: `The ${action.label} action is not yet implemented.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-card/80 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="flex flex-row items-center space-x-4 relative">
        <div className="p-2 rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
          <Icon className="w-6 h-6 text-primary animate-float" />
        </div>
        <CardTitle className="text-xl font-light">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative">
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
                className="w-full bg-primary/90 hover:bg-primary transition-colors duration-300"
                onClick={() => handleAction(actions.primary!)}
              >
                {actions.primary.label}
              </Button>
            )}
            {actions.secondary && (
              <Button 
                variant="outline" 
                className="w-full border-primary/20 hover:border-primary/40 transition-colors duration-300"
                onClick={() => handleAction(actions.secondary!)}
              >
                {actions.secondary.label}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
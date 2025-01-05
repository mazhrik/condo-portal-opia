import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const MaintenanceCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const handleSchedule = () => {
    toast({
      title: "Schedule Updated",
      description: "The maintenance schedule has been updated successfully.",
    });
  };

  return (
    <Card className="backdrop-blur-md bg-card/30 border-primary/10">
      <CardHeader>
        <CardTitle>Maintenance Calendar</CardTitle>
        <CardDescription>Schedule and manage maintenance tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border border-primary/10"
        />
      </CardContent>
    </Card>
  );
};

export default MaintenanceCalendar;
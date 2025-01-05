import { useState } from "react";
import Header from "@/components/admin/Header";
import MaintenanceCalendar from "@/components/admin/maintenance/MaintenanceCalendar";
import ScheduledTasks from "@/components/admin/maintenance/ScheduledTasks";
import { useToast } from "@/hooks/use-toast";

const MaintenanceSchedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const handleSchedule = () => {
    toast({
      title: "Schedule Updated",
      description: "The maintenance schedule has been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50 p-8">
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"
          alt="Modern interior"
          className="w-full h-full object-cover opacity-[0.03]"
        />
      </div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background to-background/50" />
      <div className="relative max-w-7xl mx-auto space-y-8">
        <Header />
        <div className="grid gap-6 md:grid-cols-2">
          <MaintenanceCalendar />
          <ScheduledTasks date={date} onSchedule={handleSchedule} />
        </div>
      </div>
    </div>
  );
};

export default MaintenanceSchedule;
import Header from "@/components/admin/Header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

const MaintenanceSchedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

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
        <div className="grid gap-6">
          <div className="p-6 rounded-lg glass">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light">Maintenance Schedule</h2>
              <Button>Schedule Maintenance</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-card/80 border border-primary/10">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
              <div className="p-4 rounded-lg bg-card/80 border border-primary/10">
                <h3 className="text-lg font-medium mb-4">Scheduled Maintenance</h3>
                <div className="space-y-4">
                  {/* Placeholder for scheduled maintenance list */}
                  <p className="text-muted-foreground">No maintenance scheduled for this date</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceSchedule;
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ScheduledTasksProps {
  date?: Date;
  onSchedule: () => void;
}

const ScheduledTasks = ({ date, onSchedule }: ScheduledTasksProps) => {
  return (
    <Card className="backdrop-blur-md bg-card/30 border-primary/10">
      <CardHeader>
        <CardTitle>Scheduled Tasks</CardTitle>
        <CardDescription>View and manage scheduled maintenance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {date && (
            <div className="p-4 rounded-lg bg-card/80 border border-primary/10">
              <h3 className="font-medium mb-2">
                {date.toLocaleDateString(undefined, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">No tasks scheduled for this date</p>
                <Button 
                  onClick={onSchedule}
                  className="bg-primary/90 hover:bg-primary transition-colors duration-300"
                >
                  Schedule Task
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduledTasks;
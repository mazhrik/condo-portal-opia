import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";

const Maintenance = () => {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Maintenance Requests</h1>
        <p className="text-gray-600">Submit and track your maintenance requests</p>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Building className="w-8 h-8 text-primary" />
            <CardTitle>Active Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Active Requests: 2</p>
              <Button className="w-full">Submit New Request</Button>
              <Button variant="outline" className="w-full">View History</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Maintenance;
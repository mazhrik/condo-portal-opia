import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

const Parking = () => {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Parking</h1>
        <p className="text-gray-600">Manage your parking space and visitor passes</p>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Car className="w-8 h-8 text-primary" />
            <CardTitle>Parking Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Your Spot: B2-45</p>
              <p className="text-sm text-gray-600">Visitor Passes: 2 Available</p>
              <Button className="w-full mt-2">Request Visitor Pass</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Parking;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const AmenityBookings = () => {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Amenity Bookings</h1>
        <p className="text-gray-600">Book and manage your amenity reservations</p>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Calendar className="w-8 h-8 text-primary" />
            <CardTitle>Your Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Upcoming Bookings</p>
              <div className="text-sm text-gray-600">
                <p>Gym - Today, 6 PM</p>
                <p>Pool - Tomorrow, 2 PM</p>
              </div>
              <Button className="w-full">Book Amenity</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AmenityBookings;
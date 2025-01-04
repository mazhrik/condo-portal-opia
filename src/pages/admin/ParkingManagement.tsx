import Header from "@/components/admin/Header";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getParkingSpots } from "@/utils/api";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ParkingManagement = () => {
  const navigate = useNavigate();
  const { data: parkingSpots, isLoading } = useQuery({
    queryKey: ['parking-spots'],
    queryFn: getParkingSpots
  });

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
              <h2 className="text-2xl font-light">Parking Management</h2>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate("/admin/parking/map")}>View Map</Button>
                <Button onClick={() => navigate("/admin/parking/registry")}>Vehicle Registry</Button>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Spots</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold">{parkingSpots?.length || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Available Spots</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold">
                    {parkingSpots?.filter(spot => !spot.is_occupied).length || 0}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Visitor Passes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold">
                    {parkingSpots?.filter(spot => spot.is_visitor).length || 0}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingManagement;
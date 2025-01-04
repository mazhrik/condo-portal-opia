import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { getParkingSpots, getVisitorPasses, requestVisitorPass } from "@/utils/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Parking = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  const { data: parkingSpot } = useQuery({
    queryKey: ['parking-spots'],
    queryFn: getParkingSpots,
  });

  const { data: visitorPasses } = useQuery({
    queryKey: ['visitor-passes'],
    queryFn: getVisitorPasses,
  });

  const requestPassMutation = useMutation({
    mutationFn: requestVisitorPass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitor-passes'] });
      setIsDialogOpen(false);
      setVisitorName("");
      setVehicleNumber("");
      toast({
        title: "Success",
        description: "Visitor pass requested successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to request visitor pass",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestPassMutation.mutate({
      visitor_name: visitorName,
      vehicle_number: vehicleNumber,
      from_date: new Date(),
      to_date: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    });
  };

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
              <p className="text-sm font-medium">Your Spot: {parkingSpot?.[0]?.spot_number}</p>
              <p className="text-sm text-gray-600">
                Visitor Passes Available: {visitorPasses?.filter(pass => pass.is_active).length || 0}
              </p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-2">Request Visitor Pass</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Visitor Pass</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Visitor Name"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Vehicle Number"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Request Pass
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Parking;
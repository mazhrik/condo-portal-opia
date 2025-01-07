import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Loader2 } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50 p-8">
      <div className="fixed inset-0 -z-10">
        <img
          src="/lovable-uploads/5f307eb2-750f-41ff-aeb3-659ec419eb29.png"
          alt="Modern interior"
          className="w-full h-full object-cover opacity-[0.03]"
        />
      </div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background to-background/50" />
      <div className="relative max-w-7xl mx-auto space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Parking</h1>
          <p className="text-gray-400">Manage your parking space and visitor passes</p>
        </header>

        <div className="space-y-6">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center space-x-4">
              <Car className="w-8 h-8 text-amber-500" />
              <CardTitle className="text-white">Parking Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-300">Your Spot: {parkingSpot?.[0]?.spot_number}</p>
                <p className="text-sm text-gray-400">
                  Visitor Passes Available: {visitorPasses?.filter(pass => pass.is_active).length || 0}
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-2 btn-gradient">Request Visitor Pass</Button>
                  </DialogTrigger>
                  <DialogContent className="glass border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-white">Request Visitor Pass</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        placeholder="Visitor Name"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                      <Input
                        placeholder="Vehicle Number"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                      <Button type="submit" className="w-full btn-gradient">
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
    </div>
  );
};

export default Parking;
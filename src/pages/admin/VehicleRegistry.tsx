import Header from "@/components/admin/Header";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Car, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getVehicles } from "@/utils/api";

const VehicleRegistry = () => {
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles
  });

  const columns = [
    {
      accessorKey: "plate",
      header: "License Plate",
    },
    {
      accessorKey: "make",
      header: "Make",
    },
    {
      accessorKey: "model",
      header: "Model",
    },
    {
      accessorKey: "owner",
      header: "Owner",
    },
    {
      accessorKey: "spot",
      header: "Parking Spot",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50 p-8">
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1554995207-c18c203602cb"
          alt="Modern interior"
          className="w-full h-full object-cover opacity-[0.03]"
        />
      </div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background to-background/50" />
      <div className="relative max-w-7xl mx-auto space-y-8">
        <Header />
        <div className="grid gap-6">
          <div className="p-6 rounded-lg glass">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Car className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-light">Vehicle Registry</h2>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Register Vehicle
              </Button>
            </div>
            <div className="bg-card/80 border border-primary/10 rounded-lg p-4">
              <DataTable
                columns={columns}
                data={vehicles || []}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleRegistry;
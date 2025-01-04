import Header from "@/components/admin/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAmenities, updateAmenityBooking } from "@/utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Amenity {
  id: number;
  name: string;
  status: 'available' | 'unavailable' | 'maintenance';
  capacity: number;
  updated_at: string;
}

const AmenityStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: amenities, isLoading } = useQuery<Amenity[]>({
    queryKey: ['amenities'],
    queryFn: getAmenities
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: number; data: { status: string } }) => 
      updateAmenityBooking(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
      toast({
        title: "Status updated",
        description: "The amenity status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update the amenity status.",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (id: number, status: string) => {
    updateMutation.mutate({ id, data: { status } });
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
        <div className="grid gap-6">
          <div className="p-6 rounded-lg glass">
            <h2 className="text-2xl font-light mb-6">Amenity Status</h2>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amenity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : amenities?.map((amenity) => (
                    <TableRow key={amenity.id}>
                      <TableCell>{amenity.name}</TableCell>
                      <TableCell>
                        <Select
                          defaultValue={amenity.status}
                          onValueChange={(value) => handleStatusUpdate(amenity.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="unavailable">Unavailable</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{new Date(amenity.updated_at).toLocaleString()}</TableCell>
                      <TableCell>{amenity.capacity}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Update Status</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmenityStatus;
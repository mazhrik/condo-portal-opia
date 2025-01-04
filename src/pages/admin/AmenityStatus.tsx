import Header from "@/components/admin/Header";
import { useQuery } from "@tanstack/react-query";
import { getAmenities } from "@/utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const AmenityStatus = () => {
  const { data: amenities, isLoading } = useQuery({
    queryKey: ['amenities'],
    queryFn: getAmenities
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
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          amenity.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {amenity.status}
                        </span>
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
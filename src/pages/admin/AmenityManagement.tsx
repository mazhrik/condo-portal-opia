import Header from "@/components/admin/Header";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getAmenities } from "@/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AmenityManagement = () => {
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light">Amenity Management</h2>
              <Button>Add Amenity</Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <p>Loading amenities...</p>
              ) : amenities?.map((amenity) => (
                <Card key={amenity.id}>
                  <CardHeader>
                    <CardTitle>{amenity.name}</CardTitle>
                    <CardDescription>{amenity.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        amenity.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {amenity.status}
                      </span>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmenityManagement;
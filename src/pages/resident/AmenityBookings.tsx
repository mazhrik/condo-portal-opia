import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAmenityBookings, createAmenityBooking, getAmenities } from "@/utils/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: number;
  amenity: number;
  date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface Amenity {
  id: number;
  name: string;
  capacity: number;
}

const AmenityBookings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAmenity, setSelectedAmenity] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['amenity-bookings'],
    queryFn: getAmenityBookings
  });

  const { data: amenities, isLoading: isLoadingAmenities } = useQuery({
    queryKey: ['amenities'],
    queryFn: getAmenities
  });

  const createBookingMutation = useMutation({
    mutationFn: createAmenityBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenity-bookings'] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Booking created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive",
      });
    },
  });

  const handleCreateBooking = () => {
    if (!selectedAmenity || !selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    createBookingMutation.mutate({
      amenity: parseInt(selectedAmenity),
      date: selectedDate,
      start_time: selectedTime,
      status: 'pending'
    });
  };

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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">Book Amenity</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Amenity Booking</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Amenity</label>
                    <Select onValueChange={setSelectedAmenity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an amenity" />
                      </SelectTrigger>
                      <SelectContent>
                        {amenities?.map((amenity: Amenity) => (
                          <SelectItem key={amenity.id} value={amenity.id.toString()}>
                            {amenity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Date</label>
                    <input
                      type="date"
                      className="w-full border rounded-md p-2"
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Time</label>
                    <input
                      type="time"
                      className="w-full border rounded-md p-2"
                      onChange={(e) => setSelectedTime(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleCreateBooking}
                    disabled={createBookingMutation.isPending}
                  >
                    {createBookingMutation.isPending ? "Creating..." : "Create Booking"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="space-y-4">
              {isLoadingBookings ? (
                <p>Loading bookings...</p>
              ) : bookings?.length === 0 ? (
                <p className="text-center text-gray-500">No bookings found</p>
              ) : (
                bookings?.map((booking: Booking) => (
                  <div key={booking.id} className="border p-4 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">
                          {amenities?.find((a: Amenity) => a.id === booking.amenity)?.name}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Time: {booking.start_time}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AmenityBookings;
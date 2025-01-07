import { supabase } from "@/integrations/supabase/client";

export interface NearbyPlace {
  name: string;
  distance: number;
  address: string;
  available_spots?: number;
  type: 'parking' | 'garage';
}

export const getNearbyParkingSpots = async (latitude: number, longitude: number, radius: number = 1000): Promise<NearbyPlace[]> => {
  try {
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .single();

    // Use the user's role to determine what parking spots they can see
    const isAdmin = userProfile?.role === 'admin';

    // For demo purposes, return some mock parking spots near the location
    // In a real application, this would make an API call to a parking service
    return [
      {
        name: "Main Street Parking",
        distance: 200,
        address: "123 Main St",
        available_spots: 15,
        type: "parking"
      },
      {
        name: "Central Garage",
        distance: 400,
        address: "456 Center Ave",
        available_spots: 50,
        type: "garage"
      },
      {
        name: "Park & Go",
        distance: 600,
        address: "789 Park Rd",
        available_spots: 25,
        type: "parking"
      }
    ];
  } catch (error) {
    console.error('Error fetching parking spots:', error);
    return [];
  }
};
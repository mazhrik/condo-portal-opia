import { supabase } from '@/integrations/supabase/client';

export interface Place {
  name: string;
  address: string;
  rating: number;
  types: string[];
  distance?: number;
}

export const getNearbyPlaces = async (latitude: number, longitude: number, radius: number = 1000): Promise<Place[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('getNearbyPlaces', {
      body: { latitude, longitude, radius }
    });

    if (error) throw error;
    return data.places;
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    throw error;
  }
}
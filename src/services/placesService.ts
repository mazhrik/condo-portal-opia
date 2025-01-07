import { supabase } from "@/integrations/supabase/client";

export interface Place {
  name: string;
  vicinity: string;
  distance: number;
  type: string;
  rating?: number;
}

export const getNearbyPlaces = async (latitude: number, longitude: number, radius: number = 1000): Promise<Place[]> => {
  try {
    // Get the current user's profile to check their role
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .single();

    // Create a Google Places service
    const location = new google.maps.LatLng(latitude, longitude);
    const service = new google.maps.places.PlacesService(document.createElement('div'));

    const request = {
      location,
      radius,
      type: ['restaurant', 'cafe', 'shopping_mall', 'supermarket', 'park']
    };

    return new Promise((resolve, reject) => {
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const places = results.map(place => ({
            name: place.name || 'Unknown Place',
            vicinity: place.vicinity || 'No address available',
            distance: google.maps.geometry.spherical.computeDistanceBetween(location, place.geometry?.location),
            type: place.types?.[0] || 'unknown',
            rating: place.rating
          }));
          resolve(places);
        } else {
          reject(new Error('Failed to fetch nearby places'));
        }
      });
    });
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
};
import { Place } from '@/types/place';

export const getNearbyPlaces = async (
  latitude: number,
  longitude: number
): Promise<Place[]> => {
  try {
    const response = await fetch(
      `/api/places?lat=${latitude}&lng=${longitude}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch nearby places');
    }

    const data = await response.json();
    return data.map((place: any): Place => ({
      id: place.place_id || String(Math.random()),
      name: place.name,
      types: place.types || [],
      vicinity: place.vicinity || '',
      rating: place.rating,
      geometry: {
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        }
      }
    }));
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    throw error;
  }
};
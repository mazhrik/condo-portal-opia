import React, { useEffect, useState } from 'react';
import { loadGoogleMapsApi } from '@/utils/loadGoogleMapsApi';
import { searchNearbyPlaces } from '@/services/placesService';
import { Alert } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
}

const ParkingPage = () => {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializePlaces = async () => {
      try {
        // Load Google Maps API
        await loadGoogleMapsApi();

        // Get user's location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        // Search for nearby places
        const nearbyPlaces = await searchNearbyPlaces(location);
        setPlaces(nearbyPlaces);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    initializePlaces();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nearby Parking Spots</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {places.map((place, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-sm">
            <h2 className="font-semibold">{place.name}</h2>
            <p className="text-gray-600">{place.vicinity}</p>
            {place.rating && (
              <p className="text-yellow-600">Rating: {place.rating} ⭐</p>
            )}
            <div className="mt-2">
              {place.types.map((type: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  {type.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingPage;
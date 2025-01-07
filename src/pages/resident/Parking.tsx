import React, { useEffect, useState } from 'react';
import { getNearbyPlaces } from '@/services/placesService';
import type { Place } from '@/types/place';

const ParkingPage: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const nearbyPlaces = await getNearbyPlaces();
        setPlaces(nearbyPlaces);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch nearby places');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  if (loading) {
    return <div>Loading parking spots...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nearby Parking Spots</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {places.map((place) => (
          <div key={place.id} className="border rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold">{place.name}</h2>
            <p className="text-gray-600">{place.vicinity}</p>
            <p className="text-sm text-gray-500">Type: {place.types[0]}</p>
            {place.rating && (
              <p className="text-sm text-yellow-600">Rating: {place.rating}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingPage;
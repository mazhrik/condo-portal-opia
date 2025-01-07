import React, { useEffect, useState } from 'react';
import { getNearbyPlaces, type Place } from '@/services/placesService';

const ParkingPage = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          
          try {
            const nearbyPlaces = await getNearbyPlaces(latitude, longitude);
            setPlaces(nearbyPlaces);
          } catch (err) {
            setError('Failed to fetch nearby places');
            console.error(err);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setError('Unable to get your location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Nearby Places</h1>
      
      {location && (
        <p className="mb-4 text-gray-600">
          Your location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {places.map((place, index) => (
          <div 
            key={index}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg">{place.name}</h3>
            <p className="text-gray-600">{place.vicinity}</p>
            <p className="text-sm text-gray-500">
              Distance: {(place.distance / 1000).toFixed(2)}km
            </p>
            {place.rating && (
              <p className="mt-2">
                Rating: {place.rating} ⭐
              </p>
            )}
            <span className="mt-2 inline-block px-2 py-1 text-xs rounded bg-gray-100">
              {place.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingPage;
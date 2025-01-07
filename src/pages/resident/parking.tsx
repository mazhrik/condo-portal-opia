import React, { useEffect, useState } from 'react';
import { getNearbyParkingSpots, type NearbyPlace } from '@/services/parkingService';

const ParkingPage = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [parkingSpots, setParkingSpots] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get user's current location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          
          try {
            const spots = await getNearbyParkingSpots(latitude, longitude);
            setParkingSpots(spots);
          } catch (err) {
            setError('Failed to fetch parking spots');
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
      <h1 className="text-2xl font-bold mb-6">Nearby Parking Spots</h1>
      
      {location && (
        <p className="mb-4 text-gray-600">
          Your location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {parkingSpots.map((spot, index) => (
          <div 
            key={index}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg">{spot.name}</h3>
            <p className="text-gray-600">{spot.address}</p>
            <p className="text-sm text-gray-500">Distance: {spot.distance}m</p>
            {spot.available_spots !== undefined && (
              <p className="mt-2 font-medium">
                Available spots: {spot.available_spots}
              </p>
            )}
            <span className="mt-2 inline-block px-2 py-1 text-xs rounded bg-gray-100">
              {spot.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingPage;
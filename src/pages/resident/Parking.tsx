import { useEffect, useState } from 'react';
import { getNearbyPlaces, Place } from '@/services/placesService';

const ParkingPage = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      try {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const nearbyPlaces = await getNearbyPlaces(latitude, longitude);
            setPlaces(nearbyPlaces);
            setLoading(false);
          }, (error) => {
            setError('Unable to get your location. Please enable location services.');
            setLoading(false);
          });
        } else {
          setError('Geolocation is not supported by your browser.');
          setLoading(false);
        }
      } catch (error) {
        setError('Error fetching nearby places.');
        setLoading(false);
      }
    };

    fetchNearbyPlaces();
  }, []);

  if (loading) {
    return <div>Loading nearby parking spots...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nearby Parking Spots</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {places.map((place, index) => (
          <div key={index} className="p-4 border rounded-lg shadow">
            <h2 className="font-bold">{place.name}</h2>
            <p className="text-gray-600">{place.address}</p>
            {place.rating && (
              <p className="text-yellow-600">Rating: {place.rating} ⭐</p>
            )}
            {place.distance && (
              <p className="text-gray-500">
                Distance: {(place.distance / 1000).toFixed(1)} km
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingPage;
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentWeather, WeatherData } from '@/services/weatherService';
import { Loader2 } from 'lucide-react';

export const Weather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user's current position
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const weatherData = await getCurrentWeather(latitude, longitude);
        setWeather(weatherData);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to fetch weather data. Please enable location services.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">{weather.location}</h3>
            <p className="text-gray-500">{weather.description}</p>
          </div>
          <div className="flex items-center">
            <img 
              src={weather.icon} 
              alt={weather.description}
              className="w-12 h-12"
            />
            <span className="text-3xl ml-2">{weather.temperature}°C</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Weather;
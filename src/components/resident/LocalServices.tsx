import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, Coffee, Utensils, Building, Wind, Thermometer } from "lucide-react";
import axios from "axios";

const API_URL = 'http://localhost:8000/api';

const LocalServices = () => {
  const { data: weather } = useQuery({
    queryKey: ['weather'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/weather/current_conditions/`);
      return response.data;
    }
  });

  const { data: restaurants } = useQuery({
    queryKey: ['businesses', 'restaurant'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/local-businesses/nearby/?type=restaurant`);
      return response.data;
    }
  });

  const { data: cafes } = useQuery({
    queryKey: ['businesses', 'cafe'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/local-businesses/nearby/?type=cafe`);
      return response.data;
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-6 w-6" />
            Current Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weather && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Temperature</p>
                  <p className="font-semibold">{weather.temperature}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Wind Speed</p>
                  <p className="font-semibold">{weather.wind_speed} km/h</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Humidity</p>
                  <p className="font-semibold">{weather.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Air Quality</p>
                  <p className="font-semibold">AQI {weather.air_quality_index}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nearby Places</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="restaurants">
            <TabsList>
              <TabsTrigger value="restaurants">
                <Utensils className="h-4 w-4 mr-2" />
                Restaurants
              </TabsTrigger>
              <TabsTrigger value="cafes">
                <Coffee className="h-4 w-4 mr-2" />
                Cafes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="restaurants">
              <div className="grid gap-4">
                {restaurants?.map((restaurant: any) => (
                  <div key={restaurant.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{restaurant.name}</h3>
                      <p className="text-sm text-gray-500">{restaurant.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">★ {restaurant.rating}</p>
                      <p className="text-sm text-gray-500">{restaurant.phone_number}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="cafes">
              <div className="grid gap-4">
                {cafes?.map((cafe: any) => (
                  <div key={cafe.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{cafe.name}</h3>
                      <p className="text-sm text-gray-500">{cafe.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">★ {cafe.rating}</p>
                      <p className="text-sm text-gray-500">{cafe.phone_number}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalServices;
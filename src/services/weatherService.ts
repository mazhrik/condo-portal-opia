const WEATHER_API_KEY = 'YOUR_API_KEY'; // You'll need to replace this with a real API key

export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  location: string;
}

export const getCurrentWeather = async (latitude: number, longitude: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }

    const data = await response.json();
    
    return {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      location: data.name
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};
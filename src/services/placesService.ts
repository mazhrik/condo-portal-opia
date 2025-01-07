interface Location {
  lat: number;
  lng: number;
}

interface PlaceResult {
  name: string;
  vicinity: string;
  rating?: number;
  types: string[];
  geometry: {
    location: Location;
  };
}

export const searchNearbyPlaces = async (location: Location): Promise<PlaceResult[]> => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error('Google Maps API not loaded'));
      return;
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      location: new window.google.maps.LatLng(location.lat, location.lng),
      radius: 1000, // 1km radius
      type: ['parking']
    };

    service.nearbySearch(
      request,
      (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results as PlaceResult[]);
        } else {
          reject(new Error('Failed to fetch nearby places'));
        }
      }
    );
  });
};
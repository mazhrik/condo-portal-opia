export interface Place {
  id: string;
  name: string;
  types: string[];
  vicinity: string;
  rating?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}
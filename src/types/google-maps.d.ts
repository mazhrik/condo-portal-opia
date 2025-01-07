declare namespace google.maps {
  export class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  export interface PlaceResult {
    name?: string;
    vicinity?: string;
    rating?: number;
    types?: string[];
    geometry?: {
      location?: google.maps.LatLng;
    };
  }
}
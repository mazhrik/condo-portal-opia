let isLoading = false;
let isLoaded = false;

export const loadGoogleMapsApi = async () => {
  if (isLoaded) return Promise.resolve();
  if (isLoading) return new Promise(resolve => setTimeout(resolve, 100));

  isLoading = true;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isLoaded = true;
      isLoading = false;
      resolve(undefined);
    };

    script.onerror = () => {
      isLoading = false;
      reject(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);
  });
};
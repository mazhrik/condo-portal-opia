import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  latitude: number;
  longitude: number;
  radius: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { latitude, longitude, radius } = await req.json() as RequestBody;
    
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=parking&key=${Deno.env.get('GOOGLE_MAPS_API_KEY')}`;
    
    const response = await fetch(url);
    const data = await response.json();

    const places = data.results.map((place: any) => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating || 0,
      types: place.types || [],
      distance: radius // This is approximate, you might want to calculate exact distance
    }));

    return new Response(
      JSON.stringify({ places }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})
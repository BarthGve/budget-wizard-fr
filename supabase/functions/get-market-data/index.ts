
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const POLYGON_API_KEY = Deno.env.get('POLYGON_API_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!POLYGON_API_KEY) {
      throw new Error('POLYGON_API_KEY is not set')
    }

    const symbols = ['I:FCHI', 'AAPL', 'BTC-EUR']
    const promises = symbols.map(async symbol => {
      let url = '';
      if (symbol === 'BTC-EUR') {
        url = `https://api.polygon.io/v2/aggs/ticker/X:BTCEUR/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`;
      } else if (symbol === 'I:FCHI') {
        url = `https://api.polygon.io/v2/aggs/ticker/I:FCHI/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`;
      } else {
        url = `https://api.polygon.io/v2/aggs/ticker/AAPL/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`;
      }

      console.log(`Fetching data for ${symbol} from URL: ${url}`);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log(`Response for ${symbol}:`, JSON.stringify(data, null, 2));

      if (!data || !data.results || data.results.length === 0) {
        console.error(`Invalid response for ${symbol}: ${JSON.stringify(data)}`);
        return {
          symbol,
          data: {
            c: 0,
            pc: 0
          }
        };
      }

      const result = data.results[0];
      return {
        symbol,
        data: {
          c: result.c,
          pc: result.o
        }
      };
    });

    const results = await Promise.all(promises);
    console.log("Final market data:", JSON.stringify(results, null, 2));

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error fetching market data:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

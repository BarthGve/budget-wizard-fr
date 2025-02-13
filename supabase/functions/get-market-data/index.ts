
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const POLYGON_API_KEY = Deno.env.get('POLYGON_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!POLYGON_API_KEY) {
      throw new Error('POLYGON_API_KEY is not set')
    }

    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)
    
    const fromDate = sevenDaysAgo.toISOString().split('T')[0]
    const toDate = today.toISOString().split('T')[0]

    const symbols = ['I:FCHI', 'AAPL', 'BTC-EUR']
    const promises = symbols.map(async symbol => {
      let url = '';
      let historyUrl = '';
      
      if (symbol === 'BTC-EUR') {
        url = `https://api.polygon.io/v2/aggs/ticker/X:BTCEUR/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`;
        historyUrl = `https://api.polygon.io/v2/aggs/ticker/X:BTCEUR/range/1/day/${fromDate}/${toDate}?adjusted=true&apiKey=${POLYGON_API_KEY}`;
      } else if (symbol === 'I:FCHI') {
        url = `https://api.polygon.io/v2/aggs/ticker/I:FCHI/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`;
        historyUrl = `https://api.polygon.io/v2/aggs/ticker/I:FCHI/range/1/day/${fromDate}/${toDate}?adjusted=true&apiKey=${POLYGON_API_KEY}`;
      } else {
        url = `https://api.polygon.io/v2/aggs/ticker/AAPL/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`;
        historyUrl = `https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/${fromDate}/${toDate}?adjusted=true&apiKey=${POLYGON_API_KEY}`;
      }

      console.log(`Fetching current data for ${symbol} from URL: ${url}`);
      console.log(`Fetching historical data for ${symbol} from URL: ${historyUrl}`);

      const [currentResponse, historyResponse] = await Promise.all([
        fetch(url),
        fetch(historyUrl)
      ]);

      const [currentData, historyData] = await Promise.all([
        currentResponse.json(),
        historyResponse.json()
      ]);

      console.log(`Current data response for ${symbol}:`, JSON.stringify(currentData, null, 2));
      console.log(`Historical data response for ${symbol}:`, JSON.stringify(historyData, null, 2));

      if (!currentData?.results?.[0]) {
        console.error(`Invalid response for ${symbol}:`, currentData);
        return {
          symbol,
          data: { c: 0, pc: 0 },
          history: []
        };
      }

      const result = currentData.results[0];
      const history = (historyData?.results || []).map((item: any) => ({
        date: new Date(item.t).toISOString().split('T')[0],
        value: item.c
      }));

      return {
        symbol,
        data: {
          c: result.c,
          pc: result.o
        },
        history
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

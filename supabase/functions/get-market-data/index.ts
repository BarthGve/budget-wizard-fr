
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const FINNHUB_API_KEY = Deno.env.get('FINNHUB_API_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!FINNHUB_API_KEY) {
      throw new Error('FINNHUB_API_KEY is not set')
    }

    // Fetch data for CAC 40 (^FCHI), MSCI World ETF (SWDA.L), and Bitcoin (BINANCE:BTCEUR)
    const symbols = ['^FCHI', 'SWDA.L', 'BINANCE:BTCEUR']
    const promises = symbols.map(symbol =>
      fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`)
        .then(res => res.json())
        .then(data => ({ symbol, data }))
    )

    const results = await Promise.all(promises)
    console.log("Market data fetched successfully:", results)

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Error fetching market data:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

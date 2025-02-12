
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

    const symbols = ['^FCHI', 'IWDA.AS', 'BTC-EUR']
    const promises = symbols.map(async symbol => {
      if (symbol === 'BTC-EUR') {
        // Pour le Bitcoin, utiliser l'endpoint Crypto
        const response = await fetch(
          `https://api.polygon.io/v2/aggs/ticker/X:BTCEUR/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
        )
        const data = await response.json()
        
        if (!data || !data.results || data.results.length === 0) {
          console.error(`Invalid response for Bitcoin: ${JSON.stringify(data)}`)
          return {
            symbol,
            data: {
              c: 0,
              pc: 0
            }
          }
        }

        const result = data.results[0]
        return {
          symbol,
          data: {
            c: result.c,  // Close price
            pc: result.o  // Open price comme previous close
          }
        }
      } else if (symbol === '^FCHI') {
        // Pour le CAC 40, utiliser l'endpoint Indices
        const response = await fetch(
          `https://api.polygon.io/v2/aggs/ticker/I:FCHI/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
        )
        const data = await response.json()
        
        if (!data || !data.results || data.results.length === 0) {
          console.error(`Invalid response for CAC40: ${JSON.stringify(data)}`)
          return {
            symbol,
            data: {
              c: 0,
              pc: 0
            }
          }
        }

        const result = data.results[0]
        return {
          symbol,
          data: {
            c: result.c,
            pc: result.o
          }
        }
      } else {
        // Pour l'ETF MSCI World
        const response = await fetch(
          `https://api.polygon.io/v2/aggs/ticker/IWDA/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
        )
        const data = await response.json()
        
        if (!data || !data.results || data.results.length === 0) {
          console.error(`Invalid response for MSCI World: ${JSON.stringify(data)}`)
          return {
            symbol,
            data: {
              c: 0,
              pc: 0
            }
          }
        }

        const result = data.results[0]
        return {
          symbol,
          data: {
            c: result.c,
            pc: result.o
          }
        }
      }
    })

    const results = await Promise.all(promises)
    console.log("Market data fetched successfully from Polygon.io:", results)

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

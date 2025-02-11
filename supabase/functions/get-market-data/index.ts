
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!ALPHA_VANTAGE_API_KEY) {
      throw new Error('ALPHA_VANTAGE_API_KEY is not set')
    }

    // Les symboles pour le CAC 40 et l'ETF MSCI World
    const symbols = ['^FCHI', 'IWDA.AS', 'BTC-EUR']
    const promises = symbols.map(async symbol => {
      // Pour le Bitcoin, on utilise un endpoint différent
      if (symbol === 'BTC-EUR') {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=EUR&apikey=${ALPHA_VANTAGE_API_KEY}`
        )
        const data = await response.json()
        
        // Vérification de la validité des données
        if (!data || !data["Realtime Currency Exchange Rate"]) {
          console.error(`Invalid response for Bitcoin: ${JSON.stringify(data)}`)
          return {
            symbol,
            data: {
              c: 0,
              pc: 0,
              d: 0,
              dp: 0
            }
          }
        }

        const rate = data["Realtime Currency Exchange Rate"]
        const currentPrice = parseFloat(rate["5. Exchange Rate"] || 0)
        
        // On simule le même format que pour les actions pour la cohérence
        return {
          symbol,
          data: {
            c: currentPrice,
            pc: currentPrice, // On n'a pas le previous close pour les crypto en temps réel
            d: 0,
            dp: 0
          }
        }
      } else {
        // Pour les actions et indices
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
        )
        const data = await response.json()
        
        // Vérification de la validité des données
        if (!data || !data["Global Quote"] || Object.keys(data["Global Quote"]).length === 0) {
          console.error(`Invalid or empty response for symbol ${symbol}: ${JSON.stringify(data)}`)
          return {
            symbol,
            data: {
              c: 0,
              pc: 0,
              d: 0,
              dp: 0
            }
          }
        }

        const quote = data["Global Quote"]
        
        // Conversion au format attendu par le frontend avec des valeurs par défaut sécurisées
        return {
          symbol,
          data: {
            c: parseFloat(quote["05. price"] || "0"),
            pc: parseFloat(quote["08. previous close"] || "0"),
            d: parseFloat(quote["09. change"] || "0"),
            dp: parseFloat((quote["10. change percent"] || "0%").replace('%', ''))
          }
        }
      }
    })

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


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
    const sixMonthsAgo = new Date(today)
    sixMonthsAgo.setMonth(today.getMonth() - 6)
    
    const fromDate = sixMonthsAgo.toISOString().split('T')[0]
    const toDate = today.toISOString().split('T')[0]

    // Indice et actions de référence affichés sur toutes les vues
    const symbols = ['I:FCHI', 'AAPL', 'BTC-EUR']
    
    // Récupérer les symboles personnalisés dans la requête si présents
    let userAssetSymbols: string[] = [];
    const url = new URL(req.url);
    const userSymbolsParam = url.searchParams.get("symbols");
    
    if (userSymbolsParam) {
      try {
        userAssetSymbols = JSON.parse(userSymbolsParam);
        console.log("Requête de prix pour les actifs utilisateur:", userAssetSymbols);
      } catch (error) {
        console.error("Erreur de parsing des symboles utilisateur:", error);
      }
    }
    
    // Combiner les symboles référence avec les symboles utilisateur
    const allSymbols = [...symbols, ...userAssetSymbols];
    
    // Déduplication des symboles
    const uniqueSymbols = [...new Set(allSymbols)];
    
    const promises = uniqueSymbols.map(async symbol => {
      let url = '';
      let historyUrl = '';
      let processedSymbol = symbol;
      let isUserAsset = userAssetSymbols.includes(symbol);
      
      // Adaptation du symbole pour l'API Polygon
      if (symbol === 'BTC-EUR') {
        processedSymbol = 'X:BTCEUR';
      } else if (symbol === 'I:FCHI') {
        processedSymbol = 'I:FCHI';
      } else if (!symbol.includes(':')) {
        // Si ce n'est pas un symbole spécial, on le considère comme une action
        processedSymbol = symbol;
      }
      
      // Construction des URLs pour les requêtes
      url = `https://api.polygon.io/v2/aggs/ticker/${processedSymbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`;
      
      // On récupère l'historique uniquement pour les symboles de référence, pas pour les actifs de l'utilisateur
      if (!isUserAsset) {
        historyUrl = `https://api.polygon.io/v2/aggs/ticker/${processedSymbol}/range/1/day/${fromDate}/${toDate}?adjusted=true&apiKey=${POLYGON_API_KEY}`;
      }

      console.log(`Fetching current data for ${symbol} using ${processedSymbol} from URL: ${url}`);
      
      try {
        // Si c'est un actif utilisateur, on ne récupère que le prix actuel
        if (isUserAsset) {
          const currentResponse = await fetch(url);
          const currentData = await currentResponse.json();
          
          console.log(`Current data response for ${symbol}:`, JSON.stringify(currentData, null, 2));
          
          if (!currentData?.results?.[0]) {
            console.error(`Invalid response for ${symbol}:`, currentData);
            return {
              symbol,
              data: { c: 0, pc: 0 },
              isUserAsset: true
            };
          }
          
          const result = currentData.results[0];
          return {
            symbol,
            data: {
              c: result.c,  // Prix de clôture
              pc: result.o   // Prix d'ouverture
            },
            isUserAsset: true
          };
        } else {
          // Pour les symboles de référence, récupérer aussi l'historique
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
        }
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        return {
          symbol,
          data: { c: 0, pc: 0 },
          history: isUserAsset ? undefined : [],
          error: error.message
        };
      }
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

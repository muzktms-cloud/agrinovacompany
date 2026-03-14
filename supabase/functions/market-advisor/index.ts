import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Government MSP rates 2024-25 (Ministry of Agriculture, India)
const MSP_RATES: Record<string, number> = {
  "Rice": 2300, "Wheat": 2275, "Maize": 2225, "Jowar": 3180, "Bajra": 2625,
  "Ragi": 4290, "Barley": 1850, "Tur/Arhar": 7000, "Moong": 8558,
  "Urad": 6950, "Groundnut": 6377, "Soybean": 4892, "Sunflower": 7280,
  "Sesamum": 8635, "Cotton": 7121, "Jute": 5335, "Sugarcane": 315,
  "Mustard": 5650, "Lentil": 6425, "Gram": 5440,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { crop, region, season, farmSize, language } = await req.json();
    
    console.log("Market Advisor request:", { crop, region, season, farmSize, language });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Find MSP for the crop
    const mspPrice = MSP_RATES[crop] || null;
    const mspContext = mspPrice 
      ? `The official Government MSP (Minimum Support Price) for ${crop} in 2024-25 is ₹${mspPrice}/quintal. This is a REAL, verified figure from the Ministry of Agriculture.`
      : `No MSP is set for ${crop}. This crop trades at open market rates.`;

    const today = new Date().toISOString().split('T')[0];

    const langInstruction = language && language !== 'en' 
      ? `\n\nIMPORTANT: Respond with all text values in the language with code "${language}". Keep JSON keys in English. Numbers stay as numbers.`
      : '';

    const systemPrompt = `You are an agricultural market analyst for South Asia. Today is ${today}.

${mspContext}

CRITICAL ACCURACY RULES:
1. **MSP as baseline**: ${mspPrice ? `Use ₹${mspPrice}/quintal as the verified MSP baseline.` : 'No MSP available.'} Market prices typically trade 0-30% above MSP depending on quality and demand.
2. **DO NOT invent specific mandi prices**. Instead, provide the MSP and a realistic range based on historical patterns. Tell farmers to verify actual prices at:
   - eNAM (enam.gov.in) - National Agriculture Market
   - Agmarknet (agmarknet.gov.in) - Agricultural Marketing Information Network
   - Local APMC mandi boards
3. **Nearby markets**: Use REAL market names for the region (APMC mandis, district markets). Provide price RANGES, not exact prices.
4. **Trends**: Base on seasonal patterns (Kharif harvest = Oct-Nov price dip, Rabi harvest = Mar-Apr price dip). Be honest about uncertainty.
5. **Confidence**: Without real-time mandi data feed, keep confidence at 50-70%.
6. **Recommendations**: Must be actionable and reference real government schemes (PM-KISAN, eNAM registration, warehouse receipt system, etc.).${langInstruction}`;

    const userPrompt = `Analyze the market for ${crop} in ${region}${season ? ` during ${season} season` : ""}${farmSize ? ` for a ${farmSize} hectare farm` : ""}.

Provide JSON response:
{
  "currentPrice": <number: ${mspPrice ? `MSP is ${mspPrice}, market likely ${Math.round(mspPrice * 1.05)}-${Math.round(mspPrice * 1.25)}` : "estimate based on crop type"}>,
  "predictedPrice": <number: estimated price for next 2-3 months based on seasonal patterns>,
  "priceChange": <number: percentage, be conservative>,
  "trend": "<'up', 'down', or 'stable' based on seasonal pattern>",
  "confidence": <number: 50-70, be honest>,
  "bestSellingTime": "<based on known seasonal price patterns>",
  "marketDemand": "<'high', 'medium', or 'low' based on season>",
  "profitabilityScore": <number: 1-10>,
  "recommendations": ["Check eNAM for real-time prices", "Other evidence-based advice", "Reference government schemes"],
  "riskFactors": ["Real risk based on seasonal data", "Another real risk"],
  "nearbyMarkets": [
    {"name": "<REAL APMC/mandi name for this region>", "distance": "<estimate>", "price": <price range midpoint>},
    {"name": "<another real market>", "distance": "<estimate>", "price": <price range midpoint>},
    {"name": "<another real market>", "distance": "<estimate>", "price": <price range midpoint>}
  ],
  "seasonalInsight": "<based on actual historical seasonal price patterns for this crop>",
  "dataSources": "Government MSP 2024-25, eNAM historical data, APMC market reports",
  "mspRate": ${mspPrice || "null"},
  "verifyPricesAt": "enam.gov.in, agmarknet.gov.in"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const text = await response.text();
      console.error("AI Gateway error:", status, text);
      
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI Gateway error: ${status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    let analysis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      // Fallback with real MSP data
      analysis = {
        currentPrice: mspPrice ? Math.round(mspPrice * 1.1) : 2500,
        predictedPrice: mspPrice ? Math.round(mspPrice * 1.15) : 2650,
        priceChange: 5,
        trend: "stable",
        confidence: 55,
        bestSellingTime: "Check eNAM for optimal timing",
        marketDemand: "medium",
        profitabilityScore: 6,
        recommendations: [
          "Check real-time prices at enam.gov.in",
          "Register on eNAM for transparent trading",
          "Consider warehouse receipt system for better prices"
        ],
        riskFactors: [
          "Prices vary significantly by quality grade",
          "Market volatility during peak harvest"
        ],
        nearbyMarkets: [
          { name: "Local APMC Mandi", distance: "~10 km", price: mspPrice || 2480 },
          { name: "District Market", distance: "~25 km", price: mspPrice ? Math.round(mspPrice * 1.05) : 2520 },
          { name: "Regional Hub", distance: "~50 km", price: mspPrice ? Math.round(mspPrice * 1.1) : 2550 }
        ],
        seasonalInsight: "Verify current rates on Agmarknet (agmarknet.gov.in).",
        mspRate: mspPrice,
        verifyPricesAt: "enam.gov.in, agmarknet.gov.in"
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Market advisor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

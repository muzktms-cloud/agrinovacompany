import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { crop, region, plantingDate, fieldConditions, language } = await req.json();
    console.log("Prediction request:", { crop, region, plantingDate, fieldConditions, language });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch real weather forecast for the region
    let weatherContext = "";
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(region)}&count=1`);
      const geoData = await geoRes.json();
      if (geoData.results?.length > 0) {
        const { latitude, longitude } = geoData.results[0];
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto&forecast_days=14`);
        const weather = await weatherRes.json();
        if (weather.daily) {
          weatherContext = `
REAL 14-DAY WEATHER FORECAST for ${region} (Open-Meteo, fetched now):
- Dates: ${weather.daily.time.join(", ")}
- Max temps: ${weather.daily.temperature_2m_max.join(", ")}°C
- Min temps: ${weather.daily.temperature_2m_min.join(", ")}°C
- Precipitation: ${weather.daily.precipitation_sum.join(", ")} mm
- Rain probability: ${weather.daily.precipitation_probability_max.join(", ")}%

Use this REAL forecast data for the weather outlook section.`;
        }
      }
    } catch (e) {
      console.error("Weather fetch failed:", e);
    }

    const today = new Date().toISOString().split('T')[0];

    const systemPrompt = `You are an agricultural analyst providing harvest predictions for South Asian farmers. Today is ${today}.

CRITICAL ACCURACY RULES:
1. **Yield estimates**: Use ONLY official data ranges from ICAR, state agricultural departments, and FAO crop statistics. For example, Indian national average rice yield is ~2.7 tonnes/hectare (DES, Ministry of Agriculture data). Quote the standard range, not a single number.
2. **Market prices**: Reference the Government of India's MSP (Minimum Support Price) as a baseline. For 2024-25: Rice MSP is ₹2,300/quintal, Wheat MSP is ₹2,275/quintal. Tell farmers to check REAL prices at eNAM (enam.gov.in) or Agmarknet (agmarknet.gov.in). Do NOT invent specific market prices.
3. **Weather outlook**: Use the REAL weather data provided below. Do NOT fabricate weather predictions.
4. **Potential problems**: Base pest/disease risks on IPM guidelines from NCIPM (National Centre for Integrated Pest Management) and the actual season.
5. **Confidence score**: Be honest. Without real field data, confidence should be 50-70%, not higher.
6. Always mention these as estimates based on historical averages and standard agricultural data.
${weatherContext}

Respond in JSON format:
{
  "harvestYield": "X-Y quintals/acre (based on [source] average for this region)",
  "yieldTrend": "+X% to -Y% depending on weather and management",
  "marketPrice": "MSP: ₹X,XXX/quintal. Check eNAM for current mandi rates.",
  "priceTrend": "Based on historical seasonal patterns",
  "weatherOutlook": "Based on the REAL 14-day forecast data above",
  "potentialProblems": [
    {"issue": "Real pest/disease for this crop-season", "probability": "X%", "severity": "Level"},
    {"issue": "Real problem", "probability": "X%", "severity": "Level"},
    {"issue": "Real problem", "probability": "X%", "severity": "Level"}
  ],
  "marketAnalysis": "Reference MSP, historical trends, and direct to eNAM/Agmarknet for real prices",
  "recommendations": ["Evidence-based recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4"],
  "confidenceScore": "55-65% (limited by available real-time field data)",
  "dataSources": "ICAR, DES (Directorate of Economics & Statistics), Open-Meteo, Government MSP rates"
}`;

    const userPrompt = `Predict harvest outcomes for:
- Crop: ${crop}
- Region: ${region}
- Planting Date: ${plantingDate}
${fieldConditions ? `- Field Conditions: ${fieldConditions}` : ""}

Use official agricultural data and real weather. Be honest about uncertainty.${language && language !== 'en' ? `\n\nIMPORTANT: Write all text values in the language with code "${language}". Keep JSON keys in English.` : ''}`;

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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }

    const result = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Prediction error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

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
    const { cropType, location, growthStage, soilType, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Fetch real weather data for the location using Open-Meteo geocoding
    let weatherContext = "";
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`);
      const geoData = await geoRes.json();
      if (geoData.results?.length > 0) {
        const { latitude, longitude } = geoData.results[0];
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto&forecast_days=7`);
        const weather = await weatherRes.json();
        if (weather.current) {
          weatherContext = `
REAL-TIME WEATHER DATA for ${location} (from Open-Meteo, fetched just now):
- Current Temperature: ${weather.current.temperature_2m}°C
- Humidity: ${weather.current.relative_humidity_2m}%
- Current Precipitation: ${weather.current.precipitation} mm
- 7-day forecast highs: ${weather.daily.temperature_2m_max.join(", ")}°C
- 7-day forecast lows: ${weather.daily.temperature_2m_min.join(", ")}°C
- 7-day precipitation: ${weather.daily.precipitation_sum.join(", ")} mm
- 7-day rain probability: ${weather.daily.precipitation_probability_max.join(", ")}%

Use this REAL weather data to provide accurate, weather-specific advice. Do NOT make up weather conditions.`;
        }
      }
    } catch (e) {
      console.error("Weather fetch failed:", e);
    }

    const langInstruction = language && language !== 'en'
      ? `\n\nIMPORTANT: Write all text values in the language with code "${language}". Keep JSON keys in English.`
      : '';

    const prompt = `You are AgriNova's crop advisor. Today is ${today}.

A farmer is growing **${cropType}** in **${location}**.
${growthStage ? `Growth Stage: ${growthStage}` : ''}
${soilType ? `Soil Type: ${soilType}` : ''}
${weatherContext}

CRITICAL ACCURACY RULES:
1. Base ALL advice on established agricultural science from sources like ICAR (Indian Council of Agricultural Research), FAO, state agricultural universities, and KVK (Krishi Vigyan Kendra) guidelines.
2. For watering advice, use standard crop water requirement data (ETc values) for the specific crop and growth stage.
3. For fertilizer advice, reference the standard NPK recommendations from soil testing guidelines and ICAR crop-specific packages of practices.
4. For pest warnings, reference the actual pest calendar and IPM (Integrated Pest Management) guidelines for this crop in this region and season.
5. Do NOT invent specific numbers. If you're unsure about a specific metric, provide the standard range from agricultural literature.
6. Reference the actual current season (Kharif/Rabi/Zaid) based on today's date.
7. For market tips, mention that farmers should check actual mandi prices on eNAM (enam.gov.in) or Agmarknet.

Provide advice in this JSON format:
{
  "dailyTip": "A specific, scientifically-backed tip for today based on the real weather and season",
  "wateringAdvice": "Based on standard ETc values and the real current weather",
  "fertilizerAdvice": "Based on ICAR recommended dose of fertilizers for this crop",
  "pestWatch": "Based on IPM guidelines and the current season's known pest pressure",
  "weatherConsiderations": "Based on the REAL weather data provided above",
  "upcomingTasks": ["Task 1 based on growth stage", "Task 2", "Task 3"],
  "harvestEstimate": "Based on standard crop duration for this variety",
  "marketTips": "Direct farmers to check eNAM/Agmarknet for real prices. Mention MSP if applicable.",
  "sustainabilityTip": "An evidence-based eco-friendly farming practice",
  "dataSources": "ICAR Package of Practices, Open-Meteo weather data, FAO crop guidelines"
}${langInstruction}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    let advice = {};
    
    if (jsonMatch) {
      try {
        advice = JSON.parse(jsonMatch[0]);
      } catch {
        advice = { dailyTip: content, error: "Could not parse structured advice" };
      }
    } else {
      advice = { dailyTip: content };
    }

    return new Response(JSON.stringify({ advice, cropType, location }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Crop advisor error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

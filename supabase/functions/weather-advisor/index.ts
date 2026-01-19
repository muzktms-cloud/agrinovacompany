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
    const { latitude, longitude, location } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Fetching weather for: ${location || `${latitude}, ${longitude}`}`);

    // Fetch weather from Open-Meteo (free, no API key needed)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max&timezone=auto`;
    
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather data");
    }
    
    const weatherData = await weatherResponse.json();
    console.log("Weather data fetched:", JSON.stringify(weatherData.current));

    // Weather code descriptions
    const weatherCodes: Record<number, string> = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };

    const current = weatherData.current;
    const daily = weatherData.daily;
    const weatherDescription = weatherCodes[current.weather_code] || "Unknown";

    // Get AI farming advice based on weather
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are AgriNova's expert farming advisor. Based on current weather conditions, provide practical, actionable farming advice. Consider:
- What activities are ideal for today's weather
- What to avoid doing
- Crop care tips specific to the conditions
- Irrigation recommendations
- Pest/disease risk based on humidity and temperature
- UV protection for workers if high

Be specific, practical, and encouraging. Format response as JSON:
{
  "summary": "Brief 1-sentence weather summary",
  "todayAdvice": ["array of 4-6 specific actions to take today"],
  "warnings": ["array of things to avoid or watch out for"],
  "irrigationTip": "specific irrigation advice",
  "pestRisk": "Low" | "Medium" | "High",
  "pestRiskReason": "why this risk level",
  "bestActivities": ["ideal farming activities for this weather"],
  "workerSafety": "any safety tips for farm workers"
}`
          },
          {
            role: "user",
            content: `Current weather in ${location || "the farm"}:
- Temperature: ${current.temperature_2m}°C
- Humidity: ${current.relative_humidity_2m}%
- Conditions: ${weatherDescription}
- Wind Speed: ${current.wind_speed_10m} km/h
- UV Index: ${current.uv_index}
- Current Precipitation: ${current.precipitation} mm

Today's forecast:
- High: ${daily.temperature_2m_max[0]}°C, Low: ${daily.temperature_2m_min[0]}°C
- Precipitation chance: ${daily.precipitation_probability_max[0]}%
- Expected rain: ${daily.precipitation_sum[0]} mm

What farming activities and precautions would you recommend for today?`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service quota exceeded. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("AI error:", await aiResponse.text());
      throw new Error("Failed to get AI advice");
    }

    const aiData = await aiResponse.json();
    const adviceContent = aiData.choices?.[0]?.message?.content;

    let advice;
    try {
      const jsonMatch = adviceContent.match(/```json\n?([\s\S]*?)\n?```/) || adviceContent.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : adviceContent;
      advice = JSON.parse(jsonStr);
    } catch {
      advice = { rawAdvice: adviceContent };
    }

    console.log("Weather advice generated successfully");

    return new Response(
      JSON.stringify({
        weather: {
          temperature: current.temperature_2m,
          humidity: current.relative_humidity_2m,
          conditions: weatherDescription,
          weatherCode: current.weather_code,
          windSpeed: current.wind_speed_10m,
          uvIndex: current.uv_index,
          precipitation: current.precipitation,
        },
        forecast: {
          high: daily.temperature_2m_max[0],
          low: daily.temperature_2m_min[0],
          precipitationChance: daily.precipitation_probability_max[0],
          precipitationSum: daily.precipitation_sum[0],
        },
        advice,
        location: location || `${latitude}, ${longitude}`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in weather-advisor:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

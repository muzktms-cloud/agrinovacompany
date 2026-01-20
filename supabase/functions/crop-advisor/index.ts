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
    const { cropType, location, growthStage, soilType } = await req.json();
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

    const prompt = `You are AgriNova's crop advisor for Southern Asian farmers. Today is ${today}.

A farmer is growing **${cropType}** in **${location}**.
${growthStage ? `Growth Stage: ${growthStage}` : ''}
${soilType ? `Soil Type: ${soilType}` : ''}

Provide comprehensive, actionable advice in the following JSON format:
{
  "dailyTip": "A specific tip for today based on the current date and season",
  "wateringAdvice": "Detailed watering recommendations",
  "fertilizerAdvice": "Fertilizer type and schedule",
  "pestWatch": "Current pest threats to watch for",
  "weatherConsiderations": "Weather-related advice for this time of year",
  "upcomingTasks": ["Task 1", "Task 2", "Task 3"],
  "harvestEstimate": "Estimated time to harvest if applicable",
  "marketTips": "Current market insights for this crop",
  "sustainabilityTip": "An eco-friendly farming tip"
}

Consider the monsoon patterns, local climate, and agricultural practices of the region. Be specific and practical.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
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
    
    // Parse JSON from response
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

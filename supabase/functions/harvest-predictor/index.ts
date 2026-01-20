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
    const { crop, region, plantingDate, fieldConditions } = await req.json();
    console.log("Prediction request:", { crop, region, plantingDate, fieldConditions });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert agricultural analyst with access to global crop data, weather patterns, and market trends for Southern Asia (India, Bangladesh, Pakistan, Sri Lanka, Nepal, Bhutan, Maldives).

Provide harvest predictions based on:
- Historical yield data for the region
- Current weather patterns and forecasts
- Market price trends
- Common pest and disease patterns
- Regional agricultural challenges

Always respond in JSON format with these exact fields:
{
  "harvestYield": "X quintals/acre",
  "yieldTrend": "+X% or -X%",
  "marketPrice": "₹X,XXX/quintal",
  "priceTrend": "+X% expected or -X% expected",
  "weatherOutlook": "Description of expected weather conditions until harvest",
  "potentialProblems": [
    {"issue": "Problem name", "probability": "X%", "severity": "Low/Medium/High"},
    {"issue": "Problem name", "probability": "X%", "severity": "Low/Medium/High"},
    {"issue": "Problem name", "probability": "X%", "severity": "Low/Medium/High"}
  ],
  "marketAnalysis": "Analysis of market conditions and best time to sell",
  "recommendations": ["recommendation1", "recommendation2", "recommendation3", "recommendation4"],
  "confidenceScore": "X%"
}`;

    const userPrompt = `Predict the harvest outcomes for:
- Crop: ${crop}
- Region: ${region}
- Planting Date: ${plantingDate}
${fieldConditions ? `- Current Field Conditions: ${fieldConditions}` : ""}

Based on global agricultural data and regional patterns, provide predictions for:
1. Expected yield compared to regional averages
2. Market price trends and best selling window
3. Potential problems and their likelihood
4. Weather outlook until expected harvest
5. Actionable recommendations`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
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
          JSON.stringify({ error: "Payment required. Please add credits to continue." }),
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

    console.log("AI response:", content);

    // Parse JSON from the response
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
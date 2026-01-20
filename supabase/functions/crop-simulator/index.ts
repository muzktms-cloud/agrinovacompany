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
    const { crop, region, landSize, budget, irrigationType } = await req.json();
    console.log("Simulation request:", { crop, region, landSize, budget, irrigationType });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert agricultural simulator with deep knowledge of farming in Southern Asia (India, Bangladesh, Pakistan, Sri Lanka, Nepal, Bhutan, Maldives). 

You must provide realistic crop simulation results based on the parameters provided. Consider:
- Regional climate patterns and monsoon seasons
- Local market conditions and crop prices in Indian Rupees
- Common pests and diseases for the region
- Water requirements based on irrigation type
- Typical yields per acre for the region

Always respond in JSON format with these exact fields:
{
  "expectedYield": "X quintals/acre",
  "profitEstimate": "₹X,XX,XXX",
  "waterRequirement": "X,XXX liters/acre",
  "pestRisk": "Low/Medium/High",
  "bestPlantingWindow": "Month - Month",
  "recommendations": ["recommendation1", "recommendation2", "recommendation3", "recommendation4"],
  "monthlyBreakdown": [
    {"month": "Month1", "activity": "Main activity", "risk": "Low/Medium/High"},
    {"month": "Month2", "activity": "Main activity", "risk": "Low/Medium/High"},
    {"month": "Month3", "activity": "Main activity", "risk": "Low/Medium/High"},
    {"month": "Month4", "activity": "Main activity", "risk": "Low/Medium/High"}
  ]
}`;

    const userPrompt = `Simulate growing ${crop} in ${region} with the following parameters:
- Land Size: ${landSize} acres
- Budget: ₹${budget.toLocaleString()}
- Irrigation Type: ${irrigationType}

Provide a realistic simulation of what to expect for the next growing season. Consider local conditions, typical yields, market prices, and common challenges.`;

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
    console.error("Simulation error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
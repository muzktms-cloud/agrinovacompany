import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, cropType } = await req.json();

    if (!imageBase64) {
      throw new Error('No image provided');
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are an expert agricultural crop health analyst. Analyze the image of crops and provide a detailed health assessment.

Categorize different parts of the visible crops into these health categories:
1. **Healthy** - Vibrant, well-nourished plants with optimal growth
2. **Needs Attention** - Minor issues that can be corrected with proper care
3. **At Risk** - Showing signs of disease, nutrient deficiency, or pest damage
4. **Severely Damaged** - Unlikely to recover, may need to be removed

For each category found, provide:
- Estimated percentage of the crop area
- Visual indicators observed
- Recommended actions

Also provide:
- Overall health score (0-100)
- Primary concerns
- Immediate action items
- Long-term recommendations

${cropType ? `The crop type is: ${cropType}` : 'Identify the crop type if possible.'}

Respond in JSON format:
{
  "cropType": "identified or provided crop type",
  "overallHealthScore": 85,
  "categories": {
    "healthy": { "percentage": 60, "indicators": ["..."], "actions": ["..."] },
    "needsAttention": { "percentage": 25, "indicators": ["..."], "actions": ["..."] },
    "atRisk": { "percentage": 10, "indicators": ["..."], "actions": ["..."] },
    "severelyDamaged": { "percentage": 5, "indicators": ["..."], "actions": ["..."] }
  },
  "primaryConcerns": ["..."],
  "immediateActions": ["..."],
  "longTermRecommendations": ["..."],
  "summary": "Brief overall assessment"
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analyze this crop image for health assessment.' },
              { type: 'image_url', image_url: { url: imageBase64 } }
            ]
          }
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse JSON from response
    let healthData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        healthData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Parse error:', parseError);
      healthData = {
        cropType: cropType || 'Unknown',
        overallHealthScore: 70,
        summary: content,
        categories: {
          healthy: { percentage: 50, indicators: ['Unable to parse detailed analysis'], actions: ['Consult an agronomist'] },
          needsAttention: { percentage: 30, indicators: [], actions: [] },
          atRisk: { percentage: 15, indicators: [], actions: [] },
          severelyDamaged: { percentage: 5, indicators: [], actions: [] }
        },
        primaryConcerns: ['Unable to perform detailed analysis'],
        immediateActions: ['Take clearer photos', 'Consult local agricultural expert'],
        longTermRecommendations: ['Regular monitoring recommended']
      };
    }

    return new Response(JSON.stringify(healthData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in crop-health-scanner:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

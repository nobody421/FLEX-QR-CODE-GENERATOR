import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

// IMPORTANT: This function requires a REPLICATE_API_TOKEN secret to be set in your Supabase project.
const REPLICATE_API_TOKEN = Deno.env.get("REPLICATE_API_TOKEN")
const MODEL_VERSION = "e044541c3d7a70358858286580e115d682678177a780b3b857b6332a1a0d1cfe";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (!REPLICATE_API_TOKEN) {
    console.error("Replicate API token is not set.");
    return new Response(JSON.stringify({ error: "AI model configuration is missing. Please contact support." }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { qr_data, prompt } = await req.json();

    if (!qr_data || !prompt) {
      return new Response(JSON.stringify({ error: "Missing URL or prompt in request body." }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const startResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          url: qr_data,
          prompt: prompt,
          qr_conditioning_scale: 2,
          num_inference_steps: 30,
          guidance_scale: 7.5,
          negative_prompt: "ugly, disfigured, low quality, blurry, nsfw"
        },
      }),
    });

    const prediction = await startResponse.json();

    if (startResponse.status !== 201) {
      return new Response(JSON.stringify({ error: prediction.detail }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const predictionUrl = prediction.urls.get;
    let finalPrediction;

    while (true) {
      const pollResponse = await fetch(predictionUrl, {
        headers: {
          "Authorization": `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      finalPrediction = await pollResponse.json();

      if (finalPrediction.status === "succeeded" || finalPrediction.status === "failed") {
        break;
      }

      await sleep(1000);
    }

    if (finalPrediction.status === "failed") {
        return new Response(JSON.stringify({ error: finalPrediction.error }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ imageUrl: finalPrediction.output[0] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})
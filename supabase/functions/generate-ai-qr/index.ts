import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

// IMPORTANT: This function now requires a GEMINI_API_TOKEN secret to be set in your Supabase project.
const GEMINI_API_TOKEN = Deno.env.get("GEMINI_API_TOKEN")
// Note: The specialized ControlNet QR generation model used previously (Replicate) is not directly available via standard Gemini APIs.
// This implementation attempts a generic image generation call, which may not produce scannable QR codes.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (!GEMINI_API_TOKEN) {
    console.error("Gemini API token is not set.");
    return new Response(JSON.stringify({ error: "AI model configuration is missing (GEMINI_API_TOKEN). Please contact support." }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { qr_data, prompt } = await req.json();

    if (!qr_data || !prompt) {
      return new Response(JSON.stringify({ error: "Missing QR data or prompt in request body." }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Construct the prompt to include the QR data context.
    const fullPrompt = `Generate a highly stylized image based on the following description: "${prompt}". The image must subtly incorporate the visual structure of a QR code that encodes the data: "${qr_data}".`;

    // 1. Call Gemini/Imagen API
    // Using a simplified structure for the Imagen API endpoint.
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key=${GEMINI_API_TOKEN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "imagen-3.0-generate-002",
        prompt: fullPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: "image/png",
          aspectRatio: "1:1",
        }
      }),
    });

    const geminiResult = await geminiResponse.json();

    if (!geminiResponse.ok || geminiResult.error) {
      console.error("Gemini API Error:", geminiResult);
      return new Response(JSON.stringify({ error: geminiResult.error?.message || "Failed to generate image using Gemini API." }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Handle output: Imagen typically returns base64 encoded images.
    // Since we cannot easily upload base64 to Supabase Storage and return a public URL in this single function call,
    // we must inform the user that further steps are needed for a complete solution.
    
    return new Response(JSON.stringify({ error: "Gemini image generation succeeded, but the output (base64 image) requires an additional step (e.g., uploading to Supabase Storage) to generate a public URL for display. This specialized QR functionality is complex to implement with generic APIs." }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });


  } catch (error) {
    console.error("General Edge Function Error:", error);
    return new Response(JSON.stringify({ error: error.message || "An unexpected server error occurred." }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})
// Updated to use Gemini API structure
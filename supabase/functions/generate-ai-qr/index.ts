import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

// IMPORTANT: This function now requires a GEMINI_API_TOKEN secret to be set in your Supabase project.
const GEMINI_API_TOKEN = Deno.env.get("GEMINI_API_TOKEN")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

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

    // 2. Handle output: Upload base64 image to Supabase Storage
    if (!geminiResult?.data?.length) {
      return new Response(JSON.stringify({ error: "No image data returned from Gemini API." }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const base64Image = geminiResult.data[0].b64_json;
    if (!base64Image) {
      return new Response(JSON.stringify({ error: "No base64 image data returned from Gemini API." }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client with service role key for storage access
    const supabaseAdmin = createClient(SUPABASE_URL ?? '', SUPABASE_SERVICE_ROLE_KEY ?? '', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });

    // Create a unique filename
    const fileName = `ai-qr-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.png`;
    
    // Convert base64 to Uint8Array
    const imageBytes = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0));
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('ai-qr-codes')
      .upload(fileName, imageBytes, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return new Response(JSON.stringify({ error: "Failed to upload image to storage." }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('ai-qr-codes')
      .getPublicUrl(fileName);

    return new Response(JSON.stringify({ 
      imageUrl: publicUrlData.publicUrl,
      message: "AI QR code generated successfully!"
    }), {
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
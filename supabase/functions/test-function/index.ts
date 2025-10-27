import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

serve(async (_req) => {
  return new Response(
    JSON.stringify({ 
      message: "Function is working correctly!",
      timestamp: new Date().toISOString()
    }),
    { 
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      } 
    }
  )
})
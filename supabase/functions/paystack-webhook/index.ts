import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Helper function to verify Paystack HMAC SHA512 signature using standard Web Crypto API
async function verifyPaystackSignature(
  secret: string,
  body: string,
  signature: string | null
): Promise<boolean> {
  if (!signature) return false;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const bodyData = encoder.encode(body);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, bodyData);
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const calculatedHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return calculatedHex === signature;
}

serve(async (req: Request) => {
  // CORS Control
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apiKey, content-type, x-paystack-signature",
      },
    });
  }

  try {
    const supabase = createClient(
      const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
      const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY") ?? "";

      const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const bodyText = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    );
    // Verify webhook payload integrity
    const isValid = await verifyPaystackSignature(paystackSecret, bodyText, signature);
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid cryptographic signature" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const event = JSON.parse(bodyText);

    // Process successful payment event
    if (event.event === "charge.success") {
      const data = event.data;
      const userId = data.metadata?.user_id;

      if (!userId) {
        return new Response(JSON.stringify({ error: "Missing user_id in metadata" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Upgrade user's subscription to active with full Paystack details
const { error: subError } = await supabase
  .from("subscriptions")
  .upsert({
    user_id: userId,
    subscription_status: "active",
    subscription_plan: data.metadata?.plan_type || "pro_monthly",
    payment_provider: "paystack",
    payment_reference: data.reference,
    paystack_reference: data.reference,
    paystack_customer_code: data.customer?.customer_code || null,
    paystack_authorization_code: data.authorization?.authorization_code || null,
    paystack_subscription_code: data.subscription_code || null,
    paystack_email_token: data.email_token || null,
    last_payment_at: new Date().toISOString(),
    paid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    paystack_raw_payload: data,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });
  
      if (subError) {
        throw new Error(`Failed to update subscription record: ${subError.message}`);
      }

      return new Response(JSON.stringify({ success: true, message: "Subscription activated" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
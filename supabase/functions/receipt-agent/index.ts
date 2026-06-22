import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
  // ─── CORS CONTROL HANDLER ───
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apiKey, content-type",
      }
    });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    /* ==========================================================================
        🛡️ PATHWAY B: REDEEMVIEW TOKEN VERIFICATION & SINGLE-USE LOCKDOWN
       ========================================================================== */
    // FIX: Explicitly check for the /verify path string to isolate execution threads cleanly
    if (path.endsWith("/verify")) {
      const { voucherToken, customerEmail } = await req.json();

      if (!voucherToken) {
        return new Response(JSON.stringify({ error: "Missing cryptographic voucher authentication token." }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      // 1. Fetch voucher record and join business settings in a single network round-trip
      const { data: voucher, error: vError } = await supabase
        .from('loyalty_vouchers')
        .select(`
          *,
          business_settings:business_id (*)
        `)
        .eq('voucher_token', voucherToken)
        .single();

      if (vError || !voucher) {
        return new Response(JSON.stringify({ error: "Invalid Token: Coupon node sequence not found in system register." }), {
          status: 404,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      // 2. ANTI-FRAUD CHECK: Block double-redemption loops instantly
      if (voucher.used) {
        return new Response(JSON.stringify({ error: "Security Exception: This specific voucher link balance has already been fully redeemed." }), {
          status: 410,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      // ─── NEW: CRITICAL TIME-BASED EXPIRATION POLICY CHECKER ───
      const settings = voucher.business_settings;
      const expirationDays = settings?.voucher_expiration_days ?? 30; 
      const voucherCreatedTime = new Date(voucher.created_at).getTime();
      const currentServerTime = new Date().getTime();
      const expirationWindowLimit = expirationDays * 24 * 60 * 60 * 1000;

      if (currentServerTime - voucherCreatedTime > expirationWindowLimit) {
        return new Response(JSON.stringify({ 
          error: `Security Exception: This voucher link timeline has expired. Authorized ${expirationDays}-day redemption period exceeded.` 
        }), {
          status: 410, // HTTP 410 Gone matches your client error screen expectations
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      // 3. ATOMIC STATE MUTATION LOCK: Mark as used immediately BEFORE processing external requests
      const { error: updateError } = await supabase
        .from('loyalty_vouchers')
        .update({ used: true, redeemed_at: new Date().toISOString() })
        .eq('id', voucher.id);

      if (updateError) throw new Error("Database concurrency lock failure. Try again.");

      // 4. PLATFORM SUITE ROUTING ENGINE
      const storePlatform = settings.platform_type?.toLowerCase() || "custom_supabase";
      const discountValue = voucher.discount_value || 10;
      
      // Generate standard clean code structure for store consumption
      const dynamicCartCouponCode = `FTC-${discountValue}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      if (storePlatform === "shopify") {
        await createShopifyCoupon(settings, dynamicCartCouponCode, discountValue);
        await supabase.from('loyalty_vouchers').update({ generated_platform_code: dynamicCartCouponCode }).eq('id', voucher.id);
      } else if (storePlatform === "woocommerce") {
        await createWooCommerceCoupon(settings, dynamicCartCouponCode, discountValue, customerEmail || voucher.customer_email);
        await supabase.from('loyalty_vouchers').update({ generated_platform_code: dynamicCartCouponCode }).eq('id', voucher.id);
      }

      return new Response(JSON.stringify({
        success: true,
        couponCode: dynamicCartCouponCode,
        discountValue: discountValue,
        storeName: settings.business_name
      }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    /* ==========================================================================
        📬 PATHWAY A: INCOMING HOOK TRANSACTION INGESTION
       ========================================================================== */
    const slug = url.searchParams.get("slug"); 
    if (!slug) {
      return new Response(JSON.stringify({ error: "Routing parameter exception: Missing merchant webhook identification identifier." }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const { customer_email, items, total_amount } = await req.json();

    const { data: settings, error: settingsError } = await supabase
      .from('business_settings')
      .select('*')
      .eq('webhook_slug', slug)
      .single();

    if (settingsError || !settings) throw new Error("Merchant configuration not found");

    const { data: transaction, error: txError } = await supabase
      .from('receipts')
      .insert({ business_id: settings.id, customer_email, items, total_amount })
      .select()
      .single();

    if (txError) throw new Error("Failed to write invoice to database");

    const uniqueVoucherToken = crypto.randomUUID();
    const discountValue = settings.discount_percentage ?? 10;

    const { error: voucherError } = await supabase
      .from('loyalty_vouchers')
      .insert({
        business_id: settings.id,
        receipt_id: transaction.id,
        voucher_token: uniqueVoucherToken,
        discount_value: discountValue,
        used: false
      });

    if (voucherError) throw new Error("Failed to register unique loyalty voucher node");

    // Unified transactional deployment link mapping
    const Live_App_URL = "https://till-slip-agent.vercel.app";
    const downloadLink = `${Live_App_URL}/receipt/${transaction.id}`;
    const redemptionUrl = `https://till-slip-agent.vercel.app/redeem?token=${uniqueVoucherToken}`;
    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=125x125&data=${encodeURIComponent(redemptionUrl)}&color=11161d`;
    const currencySymbol = settings.currency === 'USD' ? '$' : 'R';

    // Send the live transactional invoice email
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: `${settings.business_name} <onboarding@resend.dev>`,
        to: [customer_email],
        subject: `Your official receipt from ${settings.business_name}`,
        html: `
          <div style="background-color: #f8f9fa; padding: 30px; font-family: Arial, sans-serif; text-align: center;">
            <div style="max-width: 450px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #eef0f2;">
              <h2 style="color: #1e293b; text-transform: uppercase;">${settings.business_name}</h2>
              <p style="font-size: 13px; color: #64748b;">${settings.store_address}</p>
              <hr style="border: 0; border-top: 1px dashed #cbd5e1; margin: 20px 0;" />
              <p style="font-size: 15px; color: #334155;">Your order total is <strong>${currencySymbol}${total_amount.toFixed(2)}</strong>.</p>
              <div style="margin: 25px 0;">
                <a href="${downloadLink}" target="_blank" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; font-weight: 600; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 13px;">
                  Download Official Tax PDF
                </a>
              </div>
              <div style="background: #fdfdfd; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px;">
                <p style="color: #16a34a; font-weight: 700; font-size: 14px; text-transform: uppercase;">⚡ Next Visit Rewards Balance</p>
                <div style="display: inline-block; padding: 8px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 10px;">
                  <img src="${qrCodeApiUrl}" alt="Voucher Token QR" style="width: 125px; height: 125px; display: block;" />
                </div>
                <p style="color: #334155; font-size: 13px;">Scan this code to instantly claim your <strong>${discountValue}% OFF</strong> discount balance.</p>
              </div>
            </div>
          </div>
        `,
      }),
    });

    return new Response(JSON.stringify({ success: true, voucher_token: uniqueVoucherToken }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
});

/* ==========================================================================
    🔧 UTILITY INTEGRATION SUB-ROUTINES (SHOPIFY & WOOCOMMERCE)
   ========================================================================== */
async function createShopifyCoupon(settings: any, code: string, value: number) {
  if (!settings.shopify_store_domain || !settings.shopify_access_token) return;
  const endpoint = `https://${settings.shopify_store_domain}/admin/api/2024-04/price_rules.json`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "X-Shopify-Access-Token": settings.shopify_access_token, "Content-Type": "application/json" },
    body: JSON.stringify({
      price_rule: { title: code, target_type: "line_item", target_selection: "all", allocation_method: "across", value_type: "percentage", value: `-${value}.0`, customer_selection: "all", starts_at: new Date().toISOString(), usage_limit: 1 }
    })
  });
  if (!response.ok) throw new Error("Shopify engine rejected core rule configuration injection.");
  const ruleData = await response.json();
  await fetch(`https://${settings.shopify_store_domain}/admin/api/2024-04/price_rules/${ruleData.price_rule.id}/discount_codes.json`, {
    method: "POST",
    headers: { "X-Shopify-Access-Token": settings.shopify_access_token, "Content-Type": "application/json" },
    body: JSON.stringify({ discount_code: { code } })
  });
}

async function createWooCommerceCoupon(settings: any, code: string, value: number, email: string) {
  if (!settings.woocommerce_store_url || !settings.woo_consumer_key || !settings.woo_consumer_secret) return;
  const endpoint = `${settings.woocommerce_store_url}/wp-json/wc/v3/coupons`;
  const credentials = btoa(`${settings.woo_consumer_key}:${settings.woo_consumer_secret}`);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Authorization": `Basic ${credentials}`, "Content-Type": "application/json" },
    body: JSON.stringify({ code, discount_type: "percent", amount: String(value), individual_use: true, usage_limit: 1, customer_email: email ? [email] : [] })
  });
  if (!response.ok) throw new Error("WooCommerce core integration server rejected voucher injection.");
}
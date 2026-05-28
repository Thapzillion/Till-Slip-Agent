import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    // Look up via clean slug path now: /receipt-agent?slug=footballia
    const slug = url.searchParams.get("slug"); 
    const { customer_email, items, total_amount } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch business settings using the clean merchant webhook slug
    const { data: settings, error: settingsError } = await supabase
      .from('business_settings')
      .select('*')
      .eq('webhook_slug', slug)
      .single();

    if (settingsError || !settings) throw new Error("Merchant configuration not found");

    -- Save the transaction record securely
    const { data: transaction, error: txError } = await supabase
      .from('receipts')
      .insert({
        business_id: settings.id,
        customer_email,
        items,
        total_amount
      })
      .select()
      .single();

    if (txError) throw new Error("Failed to write invoice to database");

    // --- NEW: AUTOMATED SINGLE-USE LOYALTY VOUCHER ENGINE ---
    // Generate a completely random, secure cryptographic UUID for the voucher token
    const uniqueVoucherToken = crypto.randomUUID();
    const discountValue = settings.discount_percentage ?? 10;

    // Write the unique coupon record directly into your loyalty_vouchers table
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

    // Unified single-variable deployment link mapping
    const Live_App_URL = "https://till-slip-agent.vercel.app";

    // Explicitly construct the downloadLink variable using the transaction UUID
    const downloadLink = `${Live_App_URL}/receipt/${transaction.id}`;

    // Construct the live verification QR code image pointing to your redemption server loop
    const redemptionUrl = `https://ruachagent.net/redeem?token=${uniqueVoucherToken}`;
    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=125x125&data=${encodeURIComponent(redemptionUrl)}&color=11161d`;

    // Dynamic currency assignment (defaults to 'R' if no currency column exists)
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
            <div style="max-width: 450px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #eef0f2; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
              <h2 style="color: #1e293b; margin-bottom: 5px; text-transform: uppercase;">${settings.business_name}</h2>
              <p style="font-size: 13px; color: #64748b; margin-top: 0;">${settings.store_address}</p>
              
              <hr style="border: 0; border-top: 1px dashed #cbd5e1; margin: 20px 0;" />
              
              <p style="font-size: 15px; color: #334155;">Your order total is <strong>${currencySymbol}${total_amount.toFixed(2)}</strong>.</p>
              
              <div style="margin: 25px 0;">
                <a href="${downloadLink}" target="_blank" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; font-weight: 600; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 13px;">
                  Download Official Tax PDF
                </a>
              </div>

              <div style="background: #fdfdfd; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px; margin-top: 30px;">
                <p style="margin: 0 0 12px 0; color: #16a34a; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                  ⚡ Next Visit Rewards Balance
                </p>
                
                <div style="display: inline-block; padding: 8px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 10px;">
                  <img src="${qrCodeApiUrl}" alt="Voucher Token QR" style="width: 125px; height: 125px; display: block;" />
                </div>
                
                <p style="margin: 5px 0 0 0; color: #334155; font-size: 13px; font-weight: 500; line-height: 1.4;">
                  Scan this code at the counter on your next visit to instantly claim your <strong>${discountValue}% OFF</strong> discount balance.
                </p>
              </div>

            </div>
          </div>
        `,
      }),
    });

    return new Response(JSON.stringify({ success: true, voucher_token: uniqueVoucherToken }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
});
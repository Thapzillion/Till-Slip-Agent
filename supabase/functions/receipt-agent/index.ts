
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/* ==========================================================================
   CONFIGURATION
========================================================================== */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";

const LIVE_APP_URL = "https://till-slip-agent.vercel.app";

const ALLOWED_TEMPLATES = [
  "matrix-grid",
  "luxury",
  "titanium",
  "black-gold",
  "infinity-space",
  "cyber-neon",
  "classic-ink",
  "graffiti-vibes",
  "tech-hud",
];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

/* ==========================================================================
   RESPONSE HELPERS
========================================================================== */

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: CORS_HEADERS,
  });
}

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

/* ==========================================================================
   MAIN EDGE FUNCTION
========================================================================== */

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: CORS_HEADERS,
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      { error: "Only POST requests are supported." },
      405,
    );
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase server configuration is incomplete.");
    }

    const url = new URL(req.url);
    const path = url.pathname;

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    const body = await req.json();

    /* ======================================================================
       PATHWAY B: VOUCHER VERIFICATION AND REDEMPTION
       Endpoint: /functions/v1/receipt-agent/verify
    ====================================================================== */

    if (path.endsWith("/verify")) {
      const { voucherToken, customerEmail } = body;

      if (!voucherToken || typeof voucherToken !== "string") {
        return jsonResponse(
          {
            error:
              "Missing cryptographic voucher authentication token.",
          },
          400,
        );
      }

      // Fetch voucher and its associated business settings.
      const { data: voucher, error: voucherFetchError } = await supabase
        .from("loyalty_vouchers")
        .select(`
          *,
          business_settings:business_id (*)
        `)
        .eq("voucher_token", voucherToken)
        .maybeSingle();

      if (voucherFetchError || !voucher) {
        return jsonResponse(
          {
            error:
              "Invalid Token: Coupon node sequence not found in system register.",
          },
          404,
        );
      }

      if (voucher.used) {
        return jsonResponse(
          {
            error:
              "Security Exception: This specific voucher has already been redeemed.",
          },
          410,
        );
      }

      const settings = voucher.business_settings;

      if (!settings) {
        return jsonResponse(
          { error: "Associated merchant configuration was not found." },
          404,
        );
      }

      // Voucher expiration policy.
      const expirationDays = Number(
        settings.voucher_expiration_days ?? 30,
      );

      const voucherCreatedTime = new Date(
        voucher.created_at,
      ).getTime();

      const currentServerTime = Date.now();

      const expirationWindowLimit =
        expirationDays * 24 * 60 * 60 * 1000;

      if (
        !Number.isFinite(voucherCreatedTime) ||
        currentServerTime - voucherCreatedTime > expirationWindowLimit
      ) {
        return jsonResponse(
          {
            error:
              `Security Exception: This voucher has expired. ` +
              `The authorized ${expirationDays}-day redemption period was exceeded.`,
          },
          410,
        );
      }

      /*
       * ATOMIC SINGLE-USE LOCK
       *
       * Only one request can change this voucher from unused to used.
       * This prevents two simultaneous redemption requests from both
       * successfully processing the same voucher.
       */
      const { data: lockedVoucher, error: updateError } = await supabase
        .from("loyalty_vouchers")
        .update({
          used: true,
          redeemed_at: new Date().toISOString(),
        })
        .eq("id", voucher.id)
        .eq("used", false)
        .select("id")
        .maybeSingle();

      if (updateError) {
        throw new Error(
          "Database concurrency lock failure. Please try again.",
        );
      }

      if (!lockedVoucher) {
        return jsonResponse(
          {
            error:
              "This voucher has already been redeemed or is being processed.",
          },
          410,
        );
      }

      // Platform routing.
      const storePlatform = String(
        settings.platform_type ?? "custom_supabase",
      ).toLowerCase();

      const discountValue = Number(
        voucher.discount_value ?? 10,
      );

      const dynamicCartCouponCode =
        `FTC-${discountValue}-${crypto.randomUUID()
          .substring(0, 5)
          .toUpperCase()}`;

      if (storePlatform === "shopify") {
        await createShopifyCoupon(
          settings,
          dynamicCartCouponCode,
          discountValue,
        );

        const { error: codeUpdateError } = await supabase
          .from("loyalty_vouchers")
          .update({
            generated_platform_code: dynamicCartCouponCode,
          })
          .eq("id", voucher.id);

        if (codeUpdateError) {
          throw new Error(
            "The Shopify coupon was created, but the voucher record could not be updated.",
          );
        }
      } else if (storePlatform === "woocommerce") {
        await createWooCommerceCoupon(
          settings,
          dynamicCartCouponCode,
          discountValue,
          customerEmail || voucher.customer_email,
        );

        const { error: codeUpdateError } = await supabase
          .from("loyalty_vouchers")
          .update({
            generated_platform_code: dynamicCartCouponCode,
          })
          .eq("id", voucher.id);

        if (codeUpdateError) {
          throw new Error(
            "The WooCommerce coupon was created, but the voucher record could not be updated.",
          );
        }
      }

      return jsonResponse({
        success: true,
        couponCode: dynamicCartCouponCode,
        discountValue,
        storeName: settings.business_name,
      });
    }

    /* ======================================================================
       PATHWAY C: POS SIMULATOR TEST PURCHASE
       
       The simulator sends:
       {
         slug,
         customer_email,
         items,
         total_amount,
         template_id,
         design_config,
         test_purchase: true
       }

       This pathway:
       - Requires an authenticated merchant.
       - Checks ownership through business_settings.owner_id.
       - Saves the receipt.
       - Does not create a loyalty voucher.
       - Does not send a customer email.
    ====================================================================== */

    const isTestPurchase = body.test_purchase === true;

    /* ======================================================================
       PATHWAY A: NORMAL POS / WEBHOOK TRANSACTION
    ====================================================================== */

    // Accept the slug from either the body or URL query parameter.
    // The body field supports PosSimulatorView.jsx.
    const slug =
      typeof body.slug === "string" && body.slug.trim()
        ? body.slug.trim()
        : url.searchParams.get("slug");

    if (!slug) {
      return jsonResponse(
        {
          error:
            "Routing parameter exception: Missing merchant webhook identification identifier.",
        },
        400,
      );
    }

    const {
      customer_email,
      items,
      total_amount,
      template_id,
      design_config,
    } = body;

    // Validate customer email.
    if (
      typeof customer_email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email.trim())
    ) {
      return jsonResponse(
        { error: "A valid customer email address is required." },
        400,
      );
    }

    // Validate transaction items.
    if (!Array.isArray(items) || items.length === 0) {
      return jsonResponse(
        { error: "The transaction must contain at least one item." },
        400,
      );
    }

    const normalizedItems = items.map((item: any) => {
      if (
        !item ||
        typeof item !== "object" ||
        typeof item.name !== "string" ||
        !item.name.trim()
      ) {
        throw new Error("A transaction item has an invalid name.");
      }

      const price = Number(item.price);

      if (!Number.isFinite(price) || price < 0) {
        throw new Error("A transaction item has an invalid price.");
      }

      return {
        ...item,
        name: item.name.trim(),
        price,
      };
    });

    // Validate transaction total.
    const normalizedTotal = Number(total_amount);

    if (!Number.isFinite(normalizedTotal) || normalizedTotal < 0) {
      return jsonResponse(
        { error: "The transaction total is invalid." },
        400,
      );
    }

    // Validate and select the receipt template.
    const selectedTemplateId =
      typeof template_id === "string" &&
        ALLOWED_TEMPLATES.includes(template_id.trim())
        ? template_id.trim()
        : "matrix-grid";

    // Validate design configuration.
    const selectedDesignConfig =
      design_config &&
        typeof design_config === "object" &&
        !Array.isArray(design_config)
        ? design_config
        : {};

    // Find merchant configuration.
    const { data: settings, error: settingsError } = await supabase
      .from("business_settings")
      .select("*")
      .eq("webhook_slug", slug)
      .maybeSingle();

    if (settingsError || !settings) {
      return jsonResponse(
        { error: "Merchant configuration not found for this webhook slug." },
        404,
      );
    }

    /* ======================================================================
       TEST PURCHASE AUTHENTICATION AND OWNERSHIP CHECK
    ====================================================================== */

    if (isTestPurchase) {
      const authorizationHeader =
        req.headers.get("Authorization") ||
        req.headers.get("authorization");

      if (!authorizationHeader?.startsWith("Bearer ")) {
        return jsonResponse(
          {
            error:
              "Authentication required. Sign in as the merchant before running a test purchase.",
          },
          401,
        );
      }

      if (!SUPABASE_ANON_KEY) {
        throw new Error(
          "SUPABASE_ANON_KEY is required to authenticate simulator requests.",
        );
      }

      const accessToken = authorizationHeader.substring(7);

      // Use the caller's access token to verify the signed-in user.
      const userClient = createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
          global: {
            headers: {
              Authorization: authorizationHeader,
            },
          },
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        },
      );

      const {
        data: { user },
        error: userError,
      } = await userClient.auth.getUser(accessToken);

      if (userError || !user) {
        return jsonResponse(
          {
            error:
              "Your merchant session is invalid or has expired. Please sign in again.",
          },
          401,
        );
      }

      // ConnectedStores.jsx identifies the business using owner_id.
      if (!settings.owner_id || settings.owner_id !== user.id) {
        return jsonResponse(
          {
            error:
              "Access denied. You do not own the business associated with this webhook slug.",
          },
          403,
        );
      }
    }

    /* ======================================================================
       SAVE RECEIPT
       
       Both real transactions and test transactions save their receipt
       through the service-role client.
    ====================================================================== */

    const { data: transaction, error: transactionError } = await supabase
      .from("receipts")
      .insert({
        business_id: settings.id,
        customer_email: customer_email.trim(),
        items: normalizedItems,
        total_amount: normalizedTotal,
        template_id: selectedTemplateId,
        design_config: selectedDesignConfig,
      })
      .select()
      .single();

    if (transactionError || !transaction) {
      console.error("Receipt insert error:", transactionError);

      throw new Error(
        transactionError?.message ||
        "Failed to write the receipt to the database.",
      );
    }

    const downloadLink =
      `${LIVE_APP_URL}/receipt/${transaction.id}`;

    /* ======================================================================
       TEST PURCHASE RESPONSE
       
       This return happens BEFORE voucher creation and email delivery.
    ====================================================================== */

    if (isTestPurchase) {
      return jsonResponse({
        success: true,
        test_purchase: true,
        receipt_id: transaction.id,
        receipt_url: downloadLink,
        email_sent: false,
        voucher_created: false,
        message:
          "Test receipt created successfully. No customer email or loyalty voucher was generated.",
      });
    }

    /* ======================================================================
       NORMAL TRANSACTION: CREATE LOYALTY VOUCHER
    ====================================================================== */

    const uniqueVoucherToken = crypto.randomUUID();

    const discountValue = Number(
      settings.discount_percentage ?? 10,
    );

    const { error: voucherError } = await supabase
      .from("loyalty_vouchers")
      .insert({
        business_id: settings.id,
        receipt_id: transaction.id,
        voucher_token: uniqueVoucherToken,
        discount_value: discountValue,
        used: false,
      });

    if (voucherError) {
      console.error("Voucher creation error:", voucherError);

      throw new Error(
        "The receipt was saved, but the loyalty voucher could not be created: " +
        voucherError.message,
      );
    }

    /* ======================================================================
       NORMAL TRANSACTION: EMAIL AND QR LINKS
    ====================================================================== */

    const redemptionUrl =
      `${LIVE_APP_URL}/redeem?token=${uniqueVoucherToken}`;

    const qrCodeApiUrl =
      `https://api.qrserver.com/v1/create-qr-code/?size=125x125&data=${encodeURIComponent(
        redemptionUrl,
      )}&color=11161d`;

    const currencySymbol =
      settings.currency === "USD" ? "$" : "R";

    let emailSent = false;
    let emailError: string | null = null;

    if (!RESEND_API_KEY) {
      emailError = "RESEND_API_KEY is not configured.";
      console.error(emailError);
    } else {
      const businessName = escapeHtml(settings.business_name);
      const storeAddress = escapeHtml(settings.store_address);
      const safeCustomerEmail = customer_email.trim();

      try {
        const emailResponse = await fetch(
          "https://api.resend.com/emails",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: `${businessName} <onboarding@resend.dev>`,
              to: [safeCustomerEmail],
              subject:
                `Your official receipt from ${settings.business_name}`,
              html: `
                <div style="background-color:#f8f9fa;padding:30px;font-family:Arial,sans-serif;text-align:center;">
                  <div style="max-width:450px;margin:0 auto;background:#ffffff;padding:30px;border-radius:12px;border:1px solid #eef0f2;">
                    <h2 style="color:#1e293b;text-transform:uppercase;">
                      ${businessName}
                    </h2>

                    <p style="font-size:13px;color:#64748b;">
                      ${storeAddress}
                    </p>

                    <hr style="border:0;border-top:1px dashed #cbd5e1;margin:20px 0;" />

                    <p style="font-size:15px;color:#334155;">
                      Your order total is
                      <strong>
                        ${currencySymbol}${normalizedTotal.toFixed(2)}
                      </strong>.
                    </p>

                    <div style="margin:25px 0;">
                      <a
                        href="${downloadLink}"
                        target="_blank"
                        style="background-color:#0f172a;color:#ffffff;padding:12px 24px;font-weight:600;text-decoration:none;border-radius:8px;display:inline-block;font-size:13px;"
                      >
                        Download Official Tax PDF
                      </a>
                    </div>

                    <div style="background:#fdfdfd;border:1px solid #e2e8f0;padding:20px;border-radius:10px;">
                      <p style="color:#16a34a;font-weight:700;font-size:14px;text-transform:uppercase;">
                        ⚡ Next Visit Rewards Balance
                      </p>

                      <div style="display:inline-block;padding:8px;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:10px;">
                        <img
                          src="${qrCodeApiUrl}"
                          alt="Voucher Token QR"
                          style="width:125px;height:125px;display:block;"
                        />
                      </div>

                      <p style="color:#334155;font-size:13px;">
                        Scan this code to claim your
                        <strong>${discountValue}% OFF</strong>
                        discount balance.
                      </p>
                    </div>
                  </div>
                </div>
              `,
            }),
          },
        );

        if (!emailResponse.ok) {
          const responseText = await emailResponse.text();

          throw new Error(
            `Resend rejected the email (${emailResponse.status}): ${responseText}`,
          );
        }

        emailSent = true;
      } catch (emailException) {
        emailError =
          emailException instanceof Error
            ? emailException.message
            : "Unknown email delivery error.";

        console.error("Receipt email delivery failed:", emailError);
      }
    }

    /* ======================================================================
       NORMAL TRANSACTION RESPONSE
    ====================================================================== */

    return jsonResponse({
      success: true,
      test_purchase: false,
      receipt_id: transaction.id,
      receipt_url: downloadLink,
      voucher_token: uniqueVoucherToken,
      email_sent: emailSent,
      email_error: emailError,
      voucher_created: true,
    });

  } catch (error) {
    console.error("receipt-agent error:", error);

    return jsonResponse(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected server error occurred.",
      },
      400,
    );
  }
});

/* ==========================================================================
   SHOPIFY COUPON INTEGRATION
========================================================================== */

async function createShopifyCoupon(
  settings: any,
  code: string,
  value: number,
) {
  if (
    !settings.shopify_store_domain ||
    !settings.shopify_access_token
  ) {
    throw new Error(
      "Shopify credentials are not configured in business_settings.",
    );
  }

  const endpoint =
    `https://${settings.shopify_store_domain}/admin/api/2024-04/price_rules.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": settings.shopify_access_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price_rule: {
        title: code,
        target_type: "line_item",
        target_selection: "all",
        allocation_method: "across",
        value_type: "percentage",
        value: `-${value}.0`,
        customer_selection: "all",
        starts_at: new Date().toISOString(),
        usage_limit: 1,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Shopify rejected the price rule: ${errorText}`,
    );
  }

  const ruleData = await response.json();

  if (!ruleData?.price_rule?.id) {
    throw new Error(
      "Shopify did not return a valid price rule ID.",
    );
  }

  const couponResponse = await fetch(
    `https://${settings.shopify_store_domain}/admin/api/2024-04/price_rules/${ruleData.price_rule.id}/discount_codes.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": settings.shopify_access_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discount_code: { code },
      }),
    },
  );

  if (!couponResponse.ok) {
    const errorText = await couponResponse.text();

    throw new Error(
      `Shopify rejected the discount code: ${errorText}`,
    );
  }

  return await couponResponse.json();
}

/* ==========================================================================
   WOOCOMMERCE COUPON INTEGRATION
========================================================================== */

async function createWooCommerceCoupon(
  settings: any,
  code: string,
  value: number,
  email: string,
) {
  if (
    !settings.woocommerce_store_url ||
    !settings.woo_consumer_key ||
    !settings.woo_consumer_secret
  ) {
    throw new Error(
      "WooCommerce credentials are not configured in business_settings.",
    );
  }

  const storeUrl = settings.woocommerce_store_url.replace(/\/+$/, "");

  const endpoint =
    `${storeUrl}/wp-json/wc/v3/coupons`;

  const credentials = btoa(
    `${settings.woo_consumer_key}:${settings.woo_consumer_secret}`,
  );

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      discount_type: "percent",
      amount: String(value),
      individual_use: true,
      usage_limit: 1,
      customer_email: email ? [email] : [],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `WooCommerce rejected the coupon: ${errorText}`,
    );
  }

  return await response.json();
}

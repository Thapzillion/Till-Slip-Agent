import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabaseClient";
import html2pdf from "html2pdf.js";

// ============================================================
// RECEIPT TEMPLATE IMPORTS
// ============================================================

// Current production receipt design
import MatrixTillSlip from "./MatrixTillSlip";

// Add your other designs here as they are created.
//
// import TitaniumTillSlip from "./TitaniumTillSlip";
// import BlackGoldTillSlip from "./BlackGoldTillSlip";
// import CyberpunkTillSlip from "./CyberpunkTillSlip";


// ============================================================
// UNIVERSAL RECEIPT TEMPLATE REGISTRY
// ============================================================
//
// The value stored in receipts.template_id determines which
// JSX receipt component will be rendered.
//
// Example:
// template_id = "matrix-grid"
//        ↓
// MatrixTillSlip.jsx
//
// template_id = "titanium"
//        ↓
// TitaniumTillSlip.jsx
//
// template_id = "black-gold"
//        ↓
// BlackGoldTillSlip.jsx
//
// This allows ReceiptView.jsx to remain the universal renderer
// without containing copies of individual receipt designs.
// ============================================================

const templates = {
  "matrix-grid": MatrixTillSlip,

  // Add additional templates here when their files exist.
  //
  // "titanium": TitaniumTillSlip,
  // "black-gold": BlackGoldTillSlip,
  // "cyberpunk": CyberpunkTillSlip,
};


// ============================================================
// UNIVERSAL RECEIPT VIEW
// ============================================================

export default function ReceiptView() {

  const { id } = useParams();

  // --------------------------------------------------------
  // RECEIPT DATA
  // --------------------------------------------------------

  const [receipt, setReceipt] = useState(null);

  // --------------------------------------------------------
  // BUSINESS DATA
  // --------------------------------------------------------

  const [business, setBusiness] = useState(null);

  // --------------------------------------------------------
  // VOUCHER DATA
  // --------------------------------------------------------

  const [voucher, setVoucher] = useState(null);

  // --------------------------------------------------------
  // PAGE LOADING
  // --------------------------------------------------------

  const [loading, setLoading] = useState(true);

  // --------------------------------------------------------
  // VOUCHER EXPIRATION
  // --------------------------------------------------------

  const [isExpired, setIsExpired] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);


  // ========================================================
  // LOAD RECEIPT
  // ========================================================

  useEffect(() => {

    async function fetchReceiptData() {

      try {

        // ------------------------------------------------
        // 1. LOAD RECEIPT
        // ------------------------------------------------

        const {
          data: txData,
          error: txError
        } = await supabase
          .from("receipts")
          .select("*")
          .eq("id", id)
          .single();

        if (txError || !txData) {
          throw new Error("Receipt not found");
        }

        setReceipt(txData);


        // ------------------------------------------------
        // 2. LOAD BUSINESS SETTINGS
        // ------------------------------------------------

        const {
          data: bizData,
          error: bizError
        } = await supabase
          .from("business_settings")
          .select("*")
          .eq("id", txData.business_id)
          .single();

        if (bizError || !bizData) {
          throw new Error(
            "Merchant configuration missing"
          );
        }

        setBusiness(bizData);


        // ------------------------------------------------
        // 3. LOAD VOUCHER
        // ------------------------------------------------

        const {
          data: voucherData,
          error: voucherError
        } = await supabase
          .from("loyalty_vouchers")
          .select("*")
          .eq("receipt_id", txData.id)
          .single();


        // Older receipts may not have a voucher.
        // That should not prevent the receipt itself
        // from rendering.

        if (!voucherError && voucherData) {

          setVoucher(voucherData);


          // --------------------------------------------
          // CALCULATE VOUCHER EXPIRATION
          // --------------------------------------------

          const expirationDays =
            bizData.voucher_expiration_days || 30;

          const createdTime =
            new Date(
              voucherData.created_at
            ).getTime();

          const expirationTime =
            createdTime +
            expirationDays *
            24 *
            60 *
            60 *
            1000;

          const currentTime =
            new Date().getTime();


          if (currentTime >= expirationTime) {

            setIsExpired(true);
            setDaysRemaining(0);

          } else {

            setIsExpired(false);

            const msLeft =
              expirationTime -
              currentTime;

            const daysLeft =
              Math.ceil(
                msLeft /
                (1000 * 60 * 60 * 24)
              );

            setDaysRemaining(daysLeft);
          }
        }

      } catch (err) {

        console.error(
          "Receipt loading failed:",
          err.message
        );

      } finally {

        setLoading(false);
      }
    }


    if (id) {
      fetchReceiptData();
    } else {
      setLoading(false);
    }

  }, [id]);


  // ========================================================
  // PDF DOWNLOAD
  // ========================================================

  function triggerDownload() {

    const element =
      document.getElementById(
        "till-slip-capture"
      );

    if (!element) {
      console.error(
        "Receipt capture element not found."
      );

      return;
    }


    const options = {

      margin: 0,

      filename:
        `Receipt-${id?.slice(0, 7) || "invoice"}.pdf`,

      image: {
        type: "jpeg",
        quality: 0.98
      },

      html2canvas: {
        scale: 3,
        useCORS: true,
        letterRendering: true
      },

      jsPDF: {
        unit: "mm",
        format: [80, 180],
        orientation: "portrait"
      }
    };


    html2pdf()
      .set(options)
      .from(element)
      .save();
  }


  // ========================================================
  // LOADING STATE
  // ========================================================

  if (loading) {

    return (
      <div
        style={{
          color: "#9ca3af",
          padding: "40px",
          textAlign: "center",
          minHeight: "100vh",
          background: "#02090d"
        }}
      >
        Reassembling encrypted tax payload...
      </div>
    );
  }


  // ========================================================
  // INVALID RECEIPT
  // ========================================================

  if (!receipt || !business) {

    return (
      <div
        style={{
          color: "#ef4444",
          padding: "40px",
          textAlign: "center",
          minHeight: "100vh",
          background: "#02090d"
        }}
      >
        Invoice Node Invalid.
      </div>
    );
  }


  // ========================================================
  // CURRENCY
  // ========================================================

  const activeCurrencySymbol =
    business.currency === "ZAR"
      ? "R"
      : business.currency === "USD"
        ? "$"
        : business.currency === "GBP"
          ? "£"
          : business.currency === "EUR"
            ? "€"
            : business.currency === "NGN"
              ? "₦"
              : "R";


  // ========================================================
  // SECURITY RECONCILIATION
  // ========================================================

  // If the loyalty voucher exists, use its unique token.
  // Otherwise fall back to the receipt ID.

  const referenceToken =
    voucher
      ? voucher.voucher_token
      : id;


  // ========================================================
  // REDEEM / QR PAYLOAD
  // ========================================================

  const checkoutPayloadLink =
    `https://till-slip-agent.vercel.app/redeem?token=${referenceToken}&ticketId=${id}&email=${encodeURIComponent(
      receipt.customer_email || ""
    )}`;


  const qrCodeUrl =
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      checkoutPayloadLink
    )}&color=11161d&bgcolor=fff`;


  // ========================================================
  // UNIVERSAL TEMPLATE SELECTION
  // ========================================================

  // --------------------------------------------------------
  // IMPORTANT:
  //
  // New receipts should contain:
  //
  // receipt.template_id
  //
  // and:
  //
  // receipt.design_config
  //
  // Example:
  //
  // {
  //     template_id: "matrix-grid",
  //     design_config: {
  //         colors: {...},
  //         effects: {...},
  //         typography: {...},
  //         logo: {...},
  //         receipt: {...}
  //     }
  // }
  //
  // --------------------------------------------------------

  const templateId =
    receipt.template_id || "matrix-grid";


  // Find the JSX component associated with the
  // stored template ID.

  const ReceiptComponent =
    templates[templateId] ||
    MatrixTillSlip;


  // --------------------------------------------------------
  // DESIGN CONFIGURATION
  // --------------------------------------------------------
  //
  // This is the important AI connection.
  //
  // Gemini does NOT need to rewrite MatrixTillSlip.jsx.
  //
  // Gemini can modify this JSON configuration instead.
  //
  // ReceiptView passes that configuration into the
  // selected receipt component.
  // --------------------------------------------------------

  const designConfig =
    receipt.design_config || {};


  // ========================================================
  // UNIVERSAL RECEIPT RENDERER
  // ========================================================

  return (

    <div
      style={{
        background: "#02090d",
        minHeight: "100vh",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >

      <ReceiptComponent

        // ------------------------------------------------
        // CORE RECEIPT DATA
        // ------------------------------------------------

        receiptData={receipt}


        // ------------------------------------------------
        // MERCHANT / BUSINESS DATA
        // ------------------------------------------------

        settings={business}


        // ------------------------------------------------
        // USER DATA
        //
        // ReceiptView is public, so there may not be an
        // authenticated Supabase user here.
        // ------------------------------------------------

        user={null}


        // ------------------------------------------------
        // CURRENCY
        // ------------------------------------------------

        activeCurrencySymbol={
          activeCurrencySymbol
        }


        // ------------------------------------------------
        // AI DESIGN CONFIGURATION
        // ------------------------------------------------

        designConfig={designConfig}


        // ------------------------------------------------
        // VOUCHER INFORMATION
        // ------------------------------------------------

        voucher={voucher}

        isExpired={isExpired}

        daysRemaining={daysRemaining}


        // ------------------------------------------------
        // QR CODE
        // ------------------------------------------------

        qrCodeUrl={qrCodeUrl}

        checkoutPayloadLink={
          checkoutPayloadLink
        }


        // ------------------------------------------------
        // DOWNLOAD
        // ------------------------------------------------

        onDownload={triggerDownload}


        // ------------------------------------------------
        // RECEIPT ID
        // ------------------------------------------------

        receiptId={id}
      />

    </div>
  );
}


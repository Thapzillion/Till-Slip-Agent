import React from "react";

import React, { useState } from "react";


export default function Billing() {

const [loading, setLoading] = useState(false);

async function createPayment() {

    try {

        setLoading(true);

        const response = await fetch(
            "/api/create-skrill-payment",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error("Unable to create payment.");
        }

        const data = await response.json();

        if (!data.checkoutUrl) {
            throw new Error("Checkout URL missing.");
        }

        window.location.href = data.checkoutUrl;

    } catch (err) {

        console.error(err);

        alert(err.message);

    } finally {

        setLoading(false);

    }

}  

  const styles = {
    container: {
      minHeight: "100vh",
      background: `
        radial-gradient(circle at top left, rgba(0,255,200,.08), transparent 35%),
        radial-gradient(circle at bottom right, rgba(0,255,255,.05), transparent 40%),
        linear-gradient(135deg,#05070a,#081017,#07131a)
      `,
      color: "#ffffff",
      padding: "50px 20px",
      fontFamily:
        '-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,sans-serif'
    },

    wrapper: {
      maxWidth: "900px",
      margin: "0 auto"
    },

    card: {
      background:
        "linear-gradient(180deg,rgba(10,18,24,.95),rgba(8,14,18,.98))",
      border: "1px solid rgba(8,227,216,.18)",
      borderRadius: "24px",
      padding: "40px",
      boxShadow: `
      0 0 0 1px rgba(255,255,255,.02),
      0 15px 60px rgba(0,0,0,.45),
      0 0 35px rgba(8,227,216,.10)
      `
    },

    heading: {
      fontSize: "34px",
      fontWeight: 700,
      marginBottom: "5px"
    },

    subtitle: {
      color: "#8fa8ad",
      marginBottom: "40px"
    },

    price: {
      fontSize: "60px",
      color: "#08E3D8",
      fontWeight: 900
    },

    month: {
      color: "#8fa8ad",
      fontSize: "18px",
      marginBottom: "30px"
    },

    sectionTitle: {
      color: "#08E3D8",
      marginTop: "35px",
      marginBottom: "18px",
      fontSize: "22px"
    },

    feature: {
      marginBottom: "18px",
      lineHeight: "1.8",
      color: "#d4d4d4"
    },

    paymentCard: {
      marginTop: "30px",
      border: "1px solid rgba(8,227,216,.18)",
      borderRadius: "18px",
      padding: "30px",
      textAlign: "center",
      background: "rgba(255,255,255,.02)"
    },

    payButton: {
      marginTop: "25px",
      padding: "18px 34px",
      border: "none",
      borderRadius: "16px",
      cursor: "pointer",
      background:
        "linear-gradient(90deg,#00FFD5,#00B9FF)",
      color: "#041015",
      fontWeight: 700,
      fontSize: "17px",
      boxShadow:
        "0 0 25px rgba(8,227,216,.35)"
    },

    security: {
      marginTop: "35px",
      color: "#9aa5aa",
      lineHeight: "1.8",
      fontSize: "14px"
    },

    footer: {
      marginTop: "45px",
      borderTop: "1px solid rgba(255,255,255,.08)",
      paddingTop: "28px",
      color: "#9aa5aa",
      lineHeight: "1.8"
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.wrapper}>

        <div style={styles.card}>

          <h1 style={styles.heading}>
            💳 Subscription & Billing
          </h1>

          <p style={styles.subtitle}>
            RuachAgent Premium
          </p>

          <div style={styles.price}>
            $6.99
          </div>

          <div style={styles.month}>
            per month
          </div>

          <p style={{
            color:"#d4d4d4",
            lineHeight:"1.8",
            fontSize:"16px"
          }}>
            Streamline your checkout,
            automate your customer retention,
            and eliminate paper waste instantly.
          </p>

          <h2 style={styles.sectionTitle}>
            🔥 What's Included in Premium?
          </h2>

          <div style={styles.feature}>
            <strong>AI-Powered Digital Receipts</strong><br/>
            Automatically parse, structuralize and generate
            clean, responsive digital till slips from raw
            transaction text.
          </div>

          <div style={styles.feature}>
            <strong>Instant Webhook Automation</strong><br/>
            Connect seamlessly with your existing
            Point of Sale (POS) system through
            secure high-speed API endpoints.
          </div>

          <div style={styles.feature}>
            <strong>QR Discount & Voucher Redemption</strong><br/>
            Embed secure QR vouchers directly onto
            customer receipts for loyalty rewards,
            marketing campaigns and automatic
            redemption tracking.
          </div>

          <div style={styles.feature}>
            <strong>Live Merchant Analytics</strong><br/>
            Monitor synchronized receipt inboxes,
            parsed transactions, webhook deliveries,
            customer engagement and performance
            from one intelligent dashboard.
          </div>

          <div style={styles.feature}>
            <strong>Custom Business Branding</strong><br/>
            Upload your business logo,
            configure currencies,
            personalize receipt layouts,
            and create a premium experience
            that reflects your brand identity.
          </div>

          <h2 style={styles.sectionTitle}>
            💳 Secure Payment Gateway
          </h2>

          <div style={styles.paymentCard}>

            <h2 style={{
              fontSize:"42px",
              marginBottom:"10px",
              color:"#08E3D8",
              letterSpacing:"2px"
            }}>
              Skrill
            </h2>

            <p style={{
              color:"#9aa5aa",
              marginBottom:"20px"
            }}>
              Authorize your monthly Premium
              subscription securely through Skrill.
            </p>

            <button
    style={styles.payButton}
    onClick={createPayment}
    disabled={loading}
>
    {loading
        ? "Preparing Secure Checkout..."
        : "Pay with Skrill"}
</button>

          </div>

          <div style={styles.security}>

            <strong>🔒 Payment Security Notice</strong>

            <br/><br/>

            Your payment transactions are securely
            processed directly by Skrill.

            RuachAgent operates on a strict
            zero-access infrastructure regarding
            your payment cards,
            digital wallets,
            banking credentials,
            or financial information.

            Your billing credentials remain
            completely private and protected.

          </div>

          <div style={styles.footer}>

            <h3 style={{
              color:"#08E3D8"
            }}>
              ℹ️ Billing Terms & Support
            </h3>

            <p>

              <strong>Automatic Renewal</strong>

              <br/>

              Your Premium subscription automatically renews
              every 30 days unless cancelled before
              your next billing cycle.

            </p>

            <p>

              <strong>Need Billing Help?</strong>

              <br/>

              For assistance regarding payments,
              billing discrepancies,
              subscription renewals,
              or account upgrades,
              please contact our financial support team:

              <br/><br/>

              <strong style={{
                color:"#08E3D8"
              }}>
                ruachagentts@gmail.com
              </strong>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
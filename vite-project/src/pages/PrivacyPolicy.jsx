import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #0b1820, #05070A 60%)",
        color: "#eef",
        fontFamily: "Arial, sans-serif",
        padding: "60px 8%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "950px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(0,255,213,.15)",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 0 30px rgba(0,255,213,.08)",
        }}
      >
        <h1
          style={{
            color: "#00ffd5",
            marginBottom: "10px",
          }}
        >
          RuachAgent Merchant Privacy Policy
        </h1>

        <p style={{ color: "#b8d7dc" }}>
          <strong>Effective Date:</strong> July 15, 2026
          <br />
          <strong>Last Updated:</strong> July 15, 2026
        </p>

        <p style={{ lineHeight: 1.8, color: "#c9d4dd" }}>
          At <strong>RuachAgent</strong> ("we", "us", or "our"), we are committed
          to protecting the operational integrity and privacy of the merchants
          who use our automated digital receipting platform. This Privacy Policy
          explains what data we process, how we secure it, and—most
          importantly—the strict limits on what we do not access.
        </p>

        <p style={{ lineHeight: 1.8, color: "#c9d4dd" }}>
          By integrating and utilizing the RuachAgent platform, you agree to the
          processing activities outlined in this policy.
        </p>

        <hr
          style={{
            borderColor: "rgba(255,255,255,.08)",
            margin: "35px 0",
          }}
        />

        <h2 style={{ color: "#00ffd5" }}>
          1. Our "Zero-Access" Financial Guarantee
        </h2>

        <p style={{ lineHeight: 1.8, color: "#c9d4dd" }}>
          To ensure absolute peace of mind for your business and financial
          security, RuachAgent operates on a strict zero-access model regarding
          your sensitive capital.
        </p>

        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>No Access to Digital Money/Funds:</strong> RuachAgent does
            not have access to, nor does it request, store, or process your bank
            accounts, digital money, e-wallets, payment gateways, or capital
            reserves.
          </li>

          <li>
            <strong>No Payment Card Data Handling:</strong> We do not process,
            collect, or store raw credit/debit card numbers or CVVs. All
            checkout payments remain entirely within your Point of Sale (POS) or
            payment processor's secure environment.
          </li>
        </ul>

        <h2 style={{ color: "#00ffd5", marginTop: "40px" }}>
          2. What Information We Process (And Why)
        </h2>

        <h3 style={{ color: "#9ff" }}>A. Merchant Profile Data</h3>

        <p style={{ lineHeight: 1.8 }}>
          To configure your dashboard and account, we collect:
        </p>

        <ul style={{ lineHeight: 2 }}>
          <li>Business name, email address and contact details.</li>
          <li>Brand assets such as logos, receipt templates and watermarks.</li>
          <li>Currency preferences and localization settings.</li>
        </ul>

        <h3 style={{ color: "#9ff" }}>B. Transaction Payload Data</h3>

        <p style={{ lineHeight: 1.8 }}>
          When a sale clears on your POS, your webhook sends a transaction
          payload to RuachAgent. This payload is limited to:
        </p>

        <ul style={{ lineHeight: 2 }}>
          <li>Purchased line items, quantities and descriptions.</li>
          <li>Taxes, discounts and transaction totals.</li>
          <li>
            Customer delivery destination (email address or mobile number).
          </li>
        </ul>

        <h2 style={{ color: "#00ffd5", marginTop: "40px" }}>
          3. How We Process and Use Data
        </h2>

        <ul style={{ lineHeight: 2 }}>
          <li>Generate branded digital receipts in real time.</li>
          <li>Deliver receipts to customer email inboxes or smartphones.</li>
          <li>
            Populate your merchant dashboard with synchronized receipt activity.
          </li>
          <li>
            Generate QR codes for verification, loyalty vouchers and tracking.
          </li>
        </ul>

        <h2 style={{ color: "#00ffd5", marginTop: "40px" }}>
          4. Data Sharing and Third Parties
        </h2>

        <p style={{ lineHeight: 1.8 }}>
          RuachAgent does not sell, rent or trade merchant operational data to
          third-party advertisers.
        </p>

        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Service Operators:</strong> Trusted infrastructure providers
            that host and maintain the platform under strict confidentiality.
          </li>

          <li>
            <strong>Legal Obligations:</strong> Where disclosure is required by
            South African law or necessary to protect the legal rights and
            security of the platform.
          </li>
        </ul>

        <h2 style={{ color: "#00ffd5", marginTop: "40px" }}>
          5. Security Safeguards
        </h2>

        <ul style={{ lineHeight: 2 }}>
          <li>
            End-to-end TLS encryption protects webhook payloads and receipt
            assets during transmission.
          </li>

          <li>
            Merchant profiles, branding assets and receipts are stored in secure,
            access-controlled databases.
          </li>

          <li>
            Transaction payloads are retained only as long as required for
            dashboard functionality and regulatory record-keeping.
          </li>
        </ul>

        <h2 style={{ color: "#00ffd5", marginTop: "40px" }}>
          6. Your Rights Under POPIA
        </h2>

        <p style={{ lineHeight: 1.8 }}>
          In accordance with South Africa's Protection of Personal Information
          Act (POPIA), merchants have the right to:
        </p>

        <ul style={{ lineHeight: 2 }}>
          <li>Access and correct the information we hold about them.</li>
          <li>Request deletion of their merchant account.</li>
          <li>
            Object to processing that is not essential for providing the
            RuachAgent service.
          </li>
        </ul>

        <h2 style={{ color: "#00ffd5", marginTop: "40px" }}>
          7. Contact Us
        </h2>

        <p style={{ lineHeight: 1.8 }}>
          If you have any questions regarding this Privacy Policy or wish to
          exercise your data protection rights, please contact our team through
          your merchant dashboard support portal or via our official support
          email.
        </p>

        <div
          style={{
            marginTop: "50px",
            textAlign: "center",
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-block",
              padding: "14px 28px",
              borderRadius: "40px",
              background:
                "linear-gradient(90deg, #00ffd5, #00bfff)",
              color: "#001",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
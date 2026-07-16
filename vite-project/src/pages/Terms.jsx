import { Link } from "react-router-dom";

export default function Terms() {
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
        <h2
          style={{
            color: "#00ffd5",
            marginBottom: "10px",
          }}
        >
          RuachAgent Merchant Terms of Service
        </h2>

        <p style={{ color: "#b8d7dc" }}>
          <strong>Effective Date:</strong> July 15, 2026
          <br />
          <strong>Last Updated:</strong> July 15, 2026
        </p>

        <p style={{ lineHeight: 1.8, color: "#c9d4dd" }}>
          These Terms of Service ("Terms") govern your access to and use of
          <strong> RuachAgent </strong>("we", "us", or "our"), an automated
          digital receipting and integration platform. By purchasing,
          subscribing to, or using RuachAgent, you ("Merchant" or "User")
          agree to be bound by these Terms. If you do not agree with these
          Terms, you should not purchase or use our services.
        </p>

        <hr
          style={{
            borderColor: "rgba(255,255,255,.08)",
            margin: "35px 0",
          }}
        />

        <h2 style={{ color: "#00ffd5" }}>1. Description of Service</h2>

        <p style={{ lineHeight: 1.8 }}>
          RuachAgent provides cloud-based tools that parse transaction payloads
          via merchant-configured webhooks or Point of Sale (POS) systems,
          generating and distributing customized branded digital receipts with
          features including transaction tracking, dynamic layouts and QR-code
          verification.
        </p>

        <h2 style={{ color: "#00ffd5", marginTop: "40px" }}>
          2. Platform Access and Registration
        </h2>

        <h3 style={{ color: "#9ff" }}>Account Security</h3>

        <p style={{ lineHeight: 1.8 }}>
          Merchants are responsible for maintaining the confidentiality of their
          account credentials, passwords and API keys. Any activity performed
          using your account remains your sole responsibility.
        </p>

        <h3 style={{ color: "#9ff" }}>Accurate Configuration</h3>

        <p style={{ lineHeight: 1.8 }}>
          You must provide accurate business information, branding materials,
          logos and watermarks. By uploading these materials, you confirm that
          you own them or have the legal right to use them.
        </p>

        <h2 style={{ color: "#00ffd5", marginTop: "40px" }}>
          3. Webhook and POS Data Transmission
        </h2>

        <h3 style={{ color: "#9ff" }}>Data Flow Responsibility</h3>

        <p style={{ lineHeight: 1.8 }}>
          RuachAgent relies entirely on payloads transmitted from your POS
          system or webhook infrastructure. We are not responsible for
          transaction failures caused by merchant network outages, incorrect API
          configurations, webhook failures or third-party POS provider downtime.
        </p>

        <h3 style={{ color: "#9ff" }}>Payload Compliance</h3>

        <p style={{ lineHeight: 1.8 }}>
          Merchants are responsible for ensuring that webhook payloads comply
          with applicable privacy legislation, including the Protection of
          Personal Information Act (POPIA), and do not contain raw payment card
          numbers, CVVs or sensitive banking information.
        </p>

        <h2 style={{ color: "#00ffd5", marginTop: "40px" }}>
          4. Limitation of Liability and Support Disclaimer
        </h2>

        <h3 style={{ color: "#9ff" }}>"As-Is" Software Provision</h3>

        <p style={{ lineHeight: 1.8 }}>
          RuachAgent is provided on an "as-is" and "as-available" basis. While
          we continually improve the platform, we do not guarantee uninterrupted
          availability, complete freedom from software defects or compatibility
          with every proprietary POS update.
        </p>

        <h3 style={{ color: "#9ff" }}>
          Support and Communication Accountability Disclaimer
        </h3>

        <p style={{ lineHeight: 1.8 }}>
          Although we strive to provide reliable support resources and
          communication channels, RuachAgent shall not be held liable for any
          delays, interruptions or failures in support communications, software
          malfunctions, temporary service outages or merchant configuration
          issues. Merchants acknowledge that monitoring their own dashboards,
          webhook logs and system integrations forms an essential part of normal
          platform operation.
        </p>

        <h3 style={{ color: "#9ff" }}>Direct Loss Cap</h3>

        <p style={{ lineHeight: 1.8 }}>
          To the maximum extent permitted by law, RuachAgent shall not be liable
          for indirect, incidental, special or consequential damages, including
          but not limited to loss of business, profits, revenue, customer
          goodwill or receipt delivery interruptions.
        </p>

        <h2 style={{ color: "#00ffd5", marginTop: "40px" }}>
          5. Billing, Subscriptions and Refunds
        </h2>

        <ul style={{ lineHeight: 2 }}>
          <li>
            Subscription access depends on your selected service plan and
            receipt volume tier.
          </li>

          <li>
            Subscription plans automatically renew unless cancelled before the
            next billing cycle through your dashboard or by written notice.
          </li>

          <li>
            Payments are generally non-refundable unless otherwise required by
            applicable consumer protection legislation.
          </li>
        </ul>

        <h2 style={{ color: "#00ffd5", marginTop: "40px" }}>
          6. Termination of Service
        </h2>

        <p style={{ lineHeight: 1.8 }}>
          We reserve the right to suspend or permanently terminate merchant
          access without prior notice where a merchant:
        </p>

        <ul style={{ lineHeight: 2 }}>
          <li>Violates these Terms of Service.</li>
          <li>Uses the platform for fraudulent or spam-related activities.</li>
          <li>Fails to pay applicable subscription fees.</li>
        </ul>

        <p style={{ lineHeight: 1.8 }}>
          Upon termination, access to RuachAgent ends immediately, and we may
          delete merchant templates, branding assets and platform
          configurations, subject to applicable legal obligations.
        </p>

        <h2 style={{ color: "#00ffd5", marginTop: "40px" }}>
          7. Governing Law
        </h2>

        <p style={{ lineHeight: 1.8 }}>
          These Terms are governed by and interpreted in accordance with the
          laws of the Republic of South Africa. Any legal dispute arising from
          these Terms shall fall under the jurisdiction of the appropriate South
          African courts.
        </p>

        <h2 style={{ color: "#00ffd5", marginTop: "40px" }}>
          8. Modifications to Terms
        </h2>

        <p style={{ lineHeight: 1.8 }}>
          We reserve the right to revise or update these Terms at any time.
          Continued use of the RuachAgent platform after changes become
          effective constitutes your acceptance of the updated Terms of Service.
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
              background: "linear-gradient(90deg, #00ffd5, #00bfff)",
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
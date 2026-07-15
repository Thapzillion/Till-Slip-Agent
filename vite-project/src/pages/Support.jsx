import { Link } from "react-router-dom";

export default function Support() {
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
          background: "rgba(255,255,255,.03)",
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
          RuachAgent Merchant Support Policy
        </h1>

        <p
          style={{
            color: "#c9d4dd",
            lineHeight: 1.8,
          }}
        >
          At <strong>RuachAgent</strong>, we understand that smooth checkout
          operations are the heartbeat of your business. We are committed to
          providing the tools and support necessary to keep your digital
          receipts routing reliably and efficiently.
        </p>

        <p
          style={{
            color: "#c9d4dd",
            lineHeight: 1.8,
          }}
        >
          Please review our support structure, response times and contact
          guidelines below before purchasing a subscription.
        </p>

        <hr
          style={{
            borderColor: "rgba(255,255,255,.08)",
            margin: "35px 0",
          }}
        />

        <h2 style={{ color: "#00ffd5" }}>
          1. Official Support Channels
        </h2>

        <p style={{ lineHeight: 1.8 }}>
          If you experience integration issues, billing questions or need
          assistance configuring your templates, you can contact us through
          the following official support channels:
        </p>

        <div
          style={{
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(0,255,213,.15)",
            borderRadius: "18px",
            padding: "24px",
            marginTop: "20px",
          }}
        >
          <p>
            <strong>Email Support</strong>
            <br />
            <a
              href="mailto:ruachagentts@gmail.com"
              style={{
                color: "#00ffd5",
                textDecoration: "none",
              }}
            >
              ruachagentts@gmail.com
            </a>
            <br />
            <span style={{ color: "#b8d7dc" }}>
              Best for technical troubleshooting, webhook debugging and
              billing enquiries.
            </span>
          </p>

          <p style={{ marginTop: "25px" }}>
            <strong>Direct Telephonic Support</strong>
            <br />
            <a
              href="tel:+279640375"
              style={{
                color: "#00ffd5",
                textDecoration: "none",
              }}
            >
              +27 67 964 0375
            </a>
            <br />
            <span style={{ color: "#b8d7dc" }}>
              Available for urgent system-down queries.
            </span>
          </p>

          <p style={{ marginTop: "25px" }}>
            <strong>Operating Hours</strong>
            <br />
            Monday – Friday
            <br />
            08:00 AM – 05:00 PM (SAST)
          </p>
        </div>

        <h2
          style={{
            color: "#00ffd5",
            marginTop: "45px",
          }}
        >
          2. Tiered Response Times
        </h2>

        <p style={{ lineHeight: 1.8 }}>
          To minimise disruptions to your business, support requests are
          prioritised according to operational urgency.
        </p>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr
              style={{
                background: "rgba(0,255,213,.08)",
              }}
            >
              <th
                style={{
                  padding: "14px",
                  textAlign: "left",
                  border: "1px solid rgba(255,255,255,.08)",
                }}
              >
                Support Level
              </th>

              <th
                style={{
                  padding: "14px",
                  textAlign: "left",
                  border: "1px solid rgba(255,255,255,.08)",
                }}
              >
                Description
              </th>

              <th
                style={{
                  padding: "14px",
                  textAlign: "left",
                  border: "1px solid rgba(255,255,255,.08)",
                }}
              >
                Expected Response
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={{ padding: "14px", border: "1px solid rgba(255,255,255,.08)" }}>
                Critical
              </td>

              <td style={{ padding: "14px", border: "1px solid rgba(255,255,255,.08)" }}>
                Webhook completely offline or receipts not routing.
              </td>

              <td style={{ padding: "14px", border: "1px solid rgba(255,255,255,.08)" }}>
                4–12 Hours
              </td>
            </tr>

            <tr>
              <td style={{ padding: "14px", border: "1px solid rgba(255,255,255,.08)" }}>
                Technical
              </td>

              <td style={{ padding: "14px", border: "1px solid rgba(255,255,255,.08)" }}>
                Image upload issues, dashboard sync problems or receipt styling.
              </td>

              <td style={{ padding: "14px", border: "1px solid rgba(255,255,255,.08)" }}>
                Within 24 Hours
              </td>
            </tr>

            <tr>
              <td style={{ padding: "14px", border: "1px solid rgba(255,255,255,.08)" }}>
                General
              </td>

              <td style={{ padding: "14px", border: "1px solid rgba(255,255,255,.08)" }}>
                Billing enquiries, upgrades and branding questions.
              </td>

              <td style={{ padding: "14px", border: "1px solid rgba(255,255,255,.08)" }}>
                24–48 Hours
              </td>
            </tr>
          </tbody>
        </table>

        <h2
          style={{
            color: "#00ffd5",
            marginTop: "45px",
          }}
        >
          3. Merchant Troubleshooting Responsibility
        </h2>

        <p style={{ lineHeight: 1.8 }}>
          Before contacting support, we recommend verifying the following:
        </p>

        <ul style={{ lineHeight: 2 }}>
          <li>
            Confirm that your POS is successfully transmitting webhook payloads
            to your RuachAgent endpoint.
          </li>

          <li>
            Ensure logos and branding assets are uploaded in supported formats
            (PNG or JPG) and are not corrupted.
          </li>

          <li>
            Verify that your internet connection and POS system are online and
            functioning correctly.
          </li>
        </ul>

        <h2
          style={{
            color: "#00ffd5",
            marginTop: "45px",
          }}
        >
          4. Operational Support Disclaimer
        </h2>

        <p style={{ lineHeight: 1.8 }}>
          While we are committed to resolving technical issues as efficiently
          as possible and maintaining reliable receipt routing, RuachAgent
          provides support services on a best-effort basis.
        </p>

        <p style={{ lineHeight: 1.8 }}>
          As outlined in our Terms of Service, RuachAgent does not assume
          liability for operational delays, temporary receipt delivery
          interruptions, software malfunctions or any inability to immediately
          communicate with our support team. Merchants remain responsible for
          routinely monitoring their webhook logs, endpoint status and merchant
          dashboard to ensure continued system health.
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
              background: "linear-gradient(90deg,#00ffd5,#00bfff)",
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
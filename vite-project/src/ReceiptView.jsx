import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabaseClient";
import html2pdf from "html2pdf.js";

// That means I'll have to also write code for each and every one of the till slips designs.

export default function ReceiptView() {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [business, setBusiness] = useState(null);
  const [voucher, setVoucher] = useState(null); // Added state to track token relation
  const [loading, setLoading] = useState(true);

  // LIVE EXPIRATION STATE TRACKING NODES
  const [isExpired, setIsExpired] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    async function fetchReceiptData() {
      try {
        // 1. Pull the receipt row data
        const { data: txData, error: txError } = await supabase
          .from("receipts")
          .select("*")
          .eq("id", id)
          .single();

        if (txError || !txData) throw new Error("Receipt not found");
        setReceipt(txData);

        // 2. Fetch business setting properties
        const { data: bizData, error: bizError } = await supabase
          .from("business_settings")
          .select("*")
          .eq("id", txData.business_id)
          .single();

        if (bizError || !bizData) throw new Error("Merchant configuration missing");
        setBusiness(bizData);

        // 3. SECURE CONNECTION TRACE: Pull the pre-generated unique loyalty token node
        const { data: voucherData, error: voucherError } = await supabase
          .from("loyalty_vouchers")
          .select("*")
          .eq("receipt_id", txData.id)
          .single();

        // If no voucher exists yet for this older receipt, we handle gracefully or use fallback
        if (!voucherError && voucherData) {
          setVoucher(voucherData);

          // LIVE REAL-TIME EXPIRATION EVALUATION ENGINE (DYNAMIC DB DRIVEN)
          const expirationDays = bizData.voucher_expiration_days || 30;
          const createdTime = new Date(voucherData.created_at).getTime();
          const expirationTime = createdTime + expirationDays * 24 * 60 * 60 * 1000;
          const currentTime = new Date().getTime();

          if (currentTime >= expirationTime) {
            setIsExpired(true);
            setDaysRemaining(0);
          } else {
            setIsExpired(false);
            const msLeft = expirationTime - currentTime;
            const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
            setDaysRemaining(daysLeft);
          }
        }

      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false); // FIXED typo: you wrote loading(false) instead of setLoading(false)
      }
    }
    fetchReceiptData();
  }, [id]);

  function triggerDownload() {
    const element = document.getElementById("till-slip-capture");
    const options = {
      margin: 0,
      filename: `Receipt-${id.slice(0, 7)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: [80, 180], orientation: 'portrait' }
    };
    html2pdf().set(options).from(element).save();
  }

  if (loading) return <div style={{ color: "#9ca3af", padding: "40px", textAlign: "center" }}>Reassembling encrypted tax payload...</div>;
  if (!receipt || !business) return <div style={{ color: "#ef4444", padding: "40px", textAlign: "center" }}>Invoice Node Invalid.</div>;

  const activeCurrencySymbol = business.currency === "ZAR" ? "R" : business.currency === "USD" ? "$" : (business.currency || "R");

  // ─── SECURITY RECONCILIATION LAYER ───
  // Fallback to receipt ID if the backend token node hasn't synchronized table slots completely yet
  const referenceToken = voucher ? voucher.voucher_token : id;

  // Point the QR payload link exactly to your new RedeemView component endpoint parameter framework
  const checkoutPayloadLink = `https://till-slip-agent.vercel.app/redeem?token=${referenceToken}&ticketId=${id}&email=${encodeURIComponent(receipt.customer_email || '')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(checkoutPayloadLink)}&color=11161d&bgcolor=fff`;

  return (
    <div style={{ background: "#02090d", minHeight: "100vh", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

      {/* GLOBAL BACKGROUND ENCLOSURE TO MATCH ADMIN WORKSPACE MIRROR FRAME */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        border: '2px solid #08E3D8',

        background: `
linear-gradient(
180deg,
#031015 0%,
#07181D 50%,
#031015 100%
)
`,

        boxShadow: `
0 0 8px rgba(8,227,216,.65),
0 0 18px rgba(8,227,216,.35),
0 0 45px rgba(8,227,216,.12)
`,

        borderRadius: '32px',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px 16px',
        /*borderRadius: '16px'*/
      }}>

        {/* TOP GLOW EFFECT */}
        <div style={{
          position: 'absolute',
          top: '-120px',
          right: '-120px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,200,0.18), transparent 70%)',
          filter: 'blur(10px)',
          pointerEvents: 'none'
        }} />

        <h3 style={{
          margin: '0 0 18px 0',
          fontSize: '12px',
          fontWeight: '800',
          color: '#00ffd5',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          position: 'relative',
          zIndex: 2
        }}>
          Your Till Slip
        </h3>

        {/* ADVANCED DIGITAL RECEIPT CONTAINER */}
        <div id="till-slip-capture" style={{
          background: `
linear-gradient(
180deg,
#07141B 0%,
#051017 100%
)
`,
          backgroundImage: `
linear-gradient(rgba(8,227,216,.06) 1px,transparent 1px),
linear-gradient(90deg,rgba(8,227,216,.06) 1px,transparent 1px)
`,

          backgroundSize: '24px 24px',
          color: '#ffffff',
          borderRadius: '26px',
          padding: '20px 16px',
          boxShadow: `
0 0 5px rgba(8,227,216,.8),
0 0 18px rgba(8,227,216,.4),
0 30px 60px rgba(0,0,0,.65)
`,
          fontFamily: '"Courier New", monospace',
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid #08E3D8'
        }}>

          {/* RECEIPT CORNER LIGHT */}
          <div style={{
            position: 'absolute',
            top: '-80px',
            left: '-80px',
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, rgba(0,255,200,0.08), transparent 70%)',
            borderRadius: '50%'
          }} />

          {/* CENTRAL BIG LOGO WATERMARK */}
          {business?.logo_url && (
            <div style={{
              position: 'absolute',
              top: '52%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '180px',
              height: '180px',
              backgroundImage: `url(${business.logo_url})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.035,
              pointerEvents: 'none',
              zIndex: 1
            }} />
          )}

          {/* RECEIPT CONTENT WRAPPER */}
          <div style={{ position: 'relative', zIndex: 2 }}>

            {/* TOP METADATA ROW */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              fontSize: '10px',
              color: '#64748b',
              marginBottom: '9px'
            }}>
              <div style={{
                padding: '2px 5px',
                borderRadius: '999px',
                background: 'rgba(8,227,216,.10)',

                border: '2px solid #08E3D8',

                color: '#08E3D8',

                boxShadow: `
0 0 8px rgba(8,227,216,.5),
inset 0 0 10px rgba(8,227,216,.08)
`,
                fontWeight: '800',
                letterSpacing: '0.5px'
              }}>
                VERIFIED NODE
              </div>

              <div style={{
                textAlign: 'right',
                lineHeight: '1.5'
              }}>
                <div style={{
                  fontWeight: '900',
                  color: '#c5ccda',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Transaction
                </div>
                <div>{new Date(receipt.created_at).toLocaleString('en-ZA', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
              </div>
            </div>

            {/* TOP MINI LOGO */}
            <div style={{
              textAlign: 'center',
              marginBottom: '9px'
            }}>
              {business?.logo_url ? (
                <div style={{
                  display: 'inline-flex',
                  padding: '10px 18px',
                  borderRadius: '18px',
                  background: 'rgba(15, 23, 42, 0.06)',
                  border: '1px solid rgba(15,23,42,0.06)',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.08)'
                }}>
                  <img
                    src={business.logo_url}
                    alt="Merchant Logo"
                    style={{
                      maxHeight: '52px',
                      maxWidth: '170px',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              ) : (
                <div style={{
                  border: '1px dashed #94a3b8',
                  padding: '10px',
                  color: '#64748b',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  borderRadius: '12px'
                }}>
                  [ NO LOGO RECORDED ]
                </div>
              )}
            </div>

            {/* BRAND DETAILS */}
            <div style={{
              textAlign: 'center',
              marginBottom: '11px'
            }}>
              <strong style={{
                fontSize: '20px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'block',
                color: '#ffffff',
                textShadow: '0 0 10px rgba(0,255,200,0.15)'
              }}>
                {business?.business_name || 'MY BUSINESS BRAND'}
              </strong>

              <div style={{
                width: '70px',
                height: '2px',
                margin: '10px auto',
                borderRadius: '999px',
                background: 'linear-gradient(90deg, #00ffd5, #00b8ff)'
              }} />

              <div style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.85)',
                marginTop: '6px',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6',
                fontWeight: '700'
              }}>
                {business?.store_address || 'Outlet Physical Address Street\nKrugersdorp, South Africa'}
              </div>

              <div style={{
                fontSize: '11px',
                color: 'rgba(220,255,220,0.5)',
                marginTop: '6px',
                fontFamily: 'system-ui, sans-serif'
              }}>
                {receipt.customer_email}
              </div>
            </div>

            {/* PREMIUM SEPARATOR */}
            <div style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(0,255,200,0.2), transparent)',
              marginBottom: '9px'
            }} />

            {/* ITEMIZATION */}
            <div style={{
              fontSize: '11px',
              lineHeight: '1.9',
              marginBottom: '6px',
              fontWeight: '700'
            }}>

              <div style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '6px',
                color: 'rgba(0,255,200,0.6)',
                fontWeight: '900'
              }}>
                Items Purchased
              </div>

              {/* ITERATIVE ITEMS DATABASE CHECKOUT LAYER */}
              {Array.isArray(receipt.items) ? receipt.items.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                  padding: '8px 0',
                  borderBottom: '1px dashed rgba(255,255,255,0.08)'
                }}>
                  <span style={{ maxWidth: '75%' }}>
                    {item.qty || 1}x {item.name || "Store Item"}
                  </span>
                  <span style={{
                    fontWeight: '900',
                    color: '#bfc1c8'
                  }}>
                    {activeCurrencySymbol}{(item.price * (item.qty || 1)).toFixed(2)}
                  </span>
                </div>
              )) : (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                  padding: '8px 0',
                  borderBottom: '1px dashed rgba(255,255,255,0.08)'
                }}>
                  <span style={{ maxWidth: '75%' }}>
                    1x General Merchandise Node
                  </span>
                  <span style={{
                    fontWeight: '900',
                    color: '#bfc1c8'
                  }}>
                    {activeCurrencySymbol}{receipt.total_amount?.toFixed(2)}
                  </span>
                </div>
              )}

              {/* TOTAL DUE ROW */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '14px',
                padding: '16px',
                borderRadius: '16px',
                background: `
linear-gradient(
90deg,
rgba(8,227,216,.10),
rgba(8,227,216,.05)
)
`,
                border: '2px solid #08E3D8',
                fontWeight: '900',
                fontSize: '14px',
                color: '#b1b5c6',
                boxShadow: `
0 0 10px rgba(8,227,216,.45),
inset 0 0 18px rgba(8,227,216,.05)
`
              }}>
                <span>TOTAL DUE</span>
                <span style={{
                  color: '#00a884',
                  textShadow: '0 0 10px rgba(0,255,200,0.15)'
                }}>
                  {activeCurrencySymbol}{receipt.total_amount?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* VOUCHER SECTION BOX WITH LIVE CONDITIONAL EXPIRED STATES */}
            <div style={{
              background: isExpired ? 'rgba(239, 68, 68, 0.05)' : 'rgba(10, 20, 28, 0.6)',
              border: isExpired ? '1px solid rgba(239, 68, 68, 0.35)' : '2px solid #08E3D8',
              borderRadius: '22px',
              padding: '12px',
              textAlign: 'center',
              marginTop: '24px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `
0 0 10px rgba(8,227,216,.30),
0 15px 40px rgba(0,0,0,.45)
`
            }}>

              {/* INNER GLOW CHANGE BASED ON VALIDITY STATUS */}
              <div style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: isExpired
                  ? 'radial-gradient(circle, rgba(239,68,68,0.15), transparent 70%)'
                  : 'radial-gradient(circle, rgba(0,255,200,0.12), transparent 70%)'
              }} />

              <span style={{
                fontSize: '9px',
                color: isExpired ? '#ef4444' : '#00ffd5',
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '6px',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                {isExpired ? '⚠️ VOUCHER NODE EXPIRED' : '⚡ Next Visit Voucher Code Inside'}
              </span>

              {/* QR Code Container hides elements or transforms to flat placeholder variant if expired */}
              {!isExpired ? (
                <div style={{
                  display: 'inline-block',
                  padding: '12px',
                  background: '#ffffff',
                  borderRadius: '18px',
                  border: '1px solid rgba(0,255,200,0.15)',
                  boxShadow: '0 12px 25px rgba(0,0,0,0.35), 0 0 20px rgba(0,255,200,0.15)',
                  marginBottom: '5px'
                }}>
                  <img
                    src={qrCodeUrl}
                    alt="Voucher Token QR"
                    style={{
                      width: '80px',
                      height: '80px',
                      display: 'block'
                    }}
                  />
                </div>
              ) : (
                <div style={{
                  display: 'inline-block',
                  padding: '16px 20px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '14px',
                  border: '1px dashed rgba(239, 68, 68, 0.4)',
                  color: '#ef4444',
                  fontSize: '12px',
                  fontWeight: '900',
                  letterSpacing: '2px',
                  marginBottom: '8px',
                  marginTop: '4px'
                }}>
                  EXPIRED
                </div>
              )}

              <div style={{
                fontSize: '9px',
                color: isExpired ? '#94a3b8' : 'rgba(255,255,255,0.9)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '900',
                marginBottom: '4px'
              }}>
                {isExpired ? 'ACCESS CLOSED' : 'Claim Discount'}
              </div>

              <div style={{
                fontSize: '11px',
                color: isExpired ? '#94a3b8' : 'rgba(220,255,220,0.7)',
                lineHeight: '1.6',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                padding: '0 6px'
              }}>
                {isExpired ? (
                  <span>This voucher window has closed ({business?.voucher_expiration_days || 30} days authorization cycle exceeded).</span>
                ) : (
                  <span>
                    Scan to instantly claim your{' '}
                    <strong style={{ color: '#00ffd5', fontWeight: '900' }}>
                      {business?.discount_percentage ?? 10}% discount
                    </strong>{' '}
                    balance. <span style={{ color: '#00b8ff', display: 'block', fontSize: '9px', marginTop: '2px' }}>({daysRemaining} days left)</span>
                  </span>
                )}
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div style={{
              marginTop: '28px',
              textAlign: 'center'
            }}>
              <button
                onClick={triggerDownload}
                style={{
                  display: 'block',
                  width: '100%',
                  background: 'linear-gradient(90deg, #00e0b8 0%, #00ffd5 50%, #00b8ff 100%)',
                  color: '#041014',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '26px',
                  fontSize: '12px',
                  fontWeight: '900',
                  fontFamily: 'system-ui, sans-serif',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  boxShadow: `
0 0 16px rgba(8,227,216,.55),
0 10px 40px rgba(8,227,216,.22)
`,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                Download Official Invoice PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
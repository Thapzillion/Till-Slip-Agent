import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabaseClient";
import html2pdf from "html2pdf.js";

export default function ReceiptView() {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReceiptData() {
      try {
        const { data: txData, error: txError } = await supabase
          .from("receipts")
          .select("*")
          .eq("id", id)
          .single();

        if (txError || !txData) throw new Error("Receipt not found");
        setReceipt(txData);

        const { data: bizData, error: bizError } = await supabase
          .from("business_settings")
          .select("*")
          .eq("id", txData.business_id)
          .single();

        if (bizError || !bizData) throw new Error("Merchant configuration missing");
        setBusiness(bizData);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
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

  const rewardCode = `FTC${business.discount_percentage}SAVE`;
  const checkoutPayloadLink = `https://till-slip-agent.vercel.app/redeem?code=${rewardCode}&merchant=${business.webhook_slug}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(checkoutPayloadLink)}&color=0-0-0&bgcolor=fff`;

  return (
    <div style={{ background: "#090d16", minHeight: "100vh", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      
      <button onClick={triggerDownload} style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "30px", fontWeight: "bold", cursor: "pointer", marginBottom: "25px", boxShadow: "0 0 15px rgba(59,130,246,0.4)" }}>
        Download Official PDF Slip
      </button>

      <div id="till-slip-capture" style={{ width: "380px", background: "#fcfbf7", color: "#111827", padding: "30px 24px", fontFamily: "'Courier New', Courier, monospace", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "28px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" }}>⚽ {business.business_name}</div>
          <div style={{ fontSize: "11px", color: "#4b5563", marginTop: "4px", lineHeight: "1.4" }}>{business.store_address}</div>
        </div>

        <div style={{ borderTop: "2px dashed #111827", margin: "15px 0" }}></div>

        <div style={{ fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>REF: RUACH-{receipt.id.slice(0, 8).toUpperCase()}</span><span style={{ background: "#111827", color: "#fff", padding: "1px 5px", borderRadius: "3px", fontWeight: "bold", fontSize: "10px" }}>PAID</span></div>
          <div>DATE: {new Date(receipt.created_at).toLocaleString('en-ZA')}</div>
          <div>CLIENT: {receipt.customer_email}</div>
        </div>

        <div style={{ borderTop: "2px dashed #111827", margin: "15px 0" }}></div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", textTransform: "uppercase" }}>
            <span style={{ flex: 2 }}>Item Description</span>
            <span style={{ flex: 1, textAlign: "center" }}>Qty</span>
            <span style={{ flex: 1, textAlign: "right" }}>Total</span>
          </div>
          <div style={{ borderTop: "1px solid #e5e7eb", margin: "4px 0" }}></div>
          
          {Array.isArray(receipt.items) ? receipt.items.map((item, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ flex: 2, overflow: "hidden", textOverflow: "ellipsis" }}>{item.name || "Store Item"}</span>
              <span style={{ flex: 1, textAlign: "center" }}>{item.qty || 1}</span>
              <span style={{ flex: 1, textAlign: "right" }}>R{(item.price * (item.qty || 1)).toFixed(2)}</span>
            </div>
          )) : (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ flex: 2 }}>General Merchandise</span>
              <span style={{ flex: 1, textAlign: "center" }}>1</span>
              <span style={{ flex: 1, textAlign: "right" }}>R{receipt.total_amount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div style={{ borderTop: "2px dashed #111827", margin: "15px 0" }}></div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "bold" }}>
          <span>GRAND TOTAL:</span>
          <span>R{receipt.total_amount.toFixed(2)}</span>
        </div>

        <div style={{ borderTop: "2px dashed #111827", margin: "20px 0" }}></div>

        <div style={{ border: "2px dashed #111827", padding: "15px", borderRadius: "8px", textAlign: "center", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: "bold", fontSize: "12px", marginBottom: "10px" }}>
            <span>🤖 RUACHAGENT AI SMART OFFERS</span>
          </div>
          <p style={{ fontSize: "11px", margin: "0 0 12px 0", lineHeight: "1.4" }}>
            Thanks for shopping at {business.business_name}! Retain this token to get <strong style={{fontSize: "12px"}}>{business.discount_percentage}% OFF</strong> your next layout checkout session.
          </p>
          
          <div style={{ margin: "15px 0" }}>
            <img src={qrCodeUrl} alt="RuachAgent AI Token QR" style={{ width: "100px", height: "100px", border: "4px solid #111827" }} />
          </div>
          <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "1px" }}>SCAN CODE OR USE AT CHECKOUT:</div>
          <div style={{ fontSize: "15px", fontWeight: "bold", background: "#111827", color: "#fff", padding: "6px", borderRadius: "4px", marginTop: "5px", letterSpacing: "2px" }}>
            {rewardCode}
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: "9px", color: "#6b7280", marginTop: "20px", letterSpacing: "0.5px" }}>
          Powered by RuachAgent Engine<br />Node ID: {id.slice(0,8)}
        </div>
      </div>
    </div>
  );
}
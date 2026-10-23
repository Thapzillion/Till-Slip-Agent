
import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./TechTillSlip.css";

export default function TechTillSlip({
    receiptData = {},
    settings = {},
    user = null,
    activeCurrencySymbol = "",
    voucher = null,
    isExpired = false,
    daysRemaining = 0,
    qrCodeUrl = "",
    checkoutPayloadLink = "",
    receiptId = null,
    onDownload,
}) {

    /* ================================================================
       RECEIPT DATA PROCESSING
       ================================================================ */

    const receiptDataItems = Array.isArray(receiptData?.items)
        ? receiptData.items
        : [];

    const total =
        receiptData?.total ??
        receiptData?.total_amount ??
        "";

    const vat =
        receiptData?.vat ??
        receiptData?.vat_amount ??
        null;

    const transactionDate = receiptData?.created_at
        ? new Date(receiptData.created_at)
        : new Date();

    const formattedTransactionDate =
        transactionDate
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            })
            .replace(/,/g, "");

    /* ================================================================
       BRAND ASSET LOGIC
       ================================================================ */

    const logoUrl = settings?.logo_url || "";

    const watermarkUrl =
        receiptData?.watermark_url ||
        settings?.watermark_url ||
        logoUrl ||
        "";

    /* ================================================================
       CURRENCY DISPLAY LOGIC
       ================================================================ */

    const CURRENCY_SYMBOLS = {
        ZAR: "R",
        USD: "$",
        GBP: "£",
        EUR: "€",
        NGN: "₦",
    };

    const resolvedCurrencySymbol =
        activeCurrencySymbol ||
        CURRENCY_SYMBOLS[
        settings?.currency ||
        receiptData?.currency ||
        "ZAR"
        ] ||
        "";

    const formatCurrency = (value) => {
        if (value === null || value === undefined || value === "") {
            return "";
        }

        const raw = String(value).trim();

        if (resolvedCurrencySymbol && raw.startsWith(resolvedCurrencySymbol)) {
            return raw;
        }

        const numeric = Number(raw.replace(/,/g, ""));

        if (Number.isFinite(numeric)) {
            return `${resolvedCurrencySymbol}${resolvedCurrencySymbol ? " " : ""}${numeric.toFixed(2)}`;
        }

        return `${resolvedCurrencySymbol}${resolvedCurrencySymbol ? " " : ""}${raw}`;
    };

    /* ================================================================
       DOWNLOAD HANDLER
       ================================================================ */

    const handleDownload = (event) => {
        if (event) {
            event.preventDefault();
        }

        if (typeof onDownload === "function") {
            onDownload();
        } else {
            console.warn(
                "TechTillSlip: onDownload handler was not supplied."
            );
        }
    };

    /* ================================================================
       CONNECTED BUSINESS AND RECEIPT DETAILS
       Reads existing data only. No simulator inputs are created.
       ================================================================ */

    const businessName =
        settings?.business_name ||
        settings?.company_name ||
        receiptData?.business_name ||
        receiptData?.company_name ||
        "";

    const businessAddress =
        settings?.business_address ||
        settings?.address ||
        receiptData?.business_address ||
        receiptData?.address ||
        "";

    const businessPhone =
        settings?.business_phone ||
        settings?.phone ||
        receiptData?.business_phone ||
        receiptData?.phone ||
        "";

    const businessEmail =
        settings?.business_email ||
        settings?.email ||
        receiptData?.business_email ||
        receiptData?.email ||
        "";

    const businessWebsite =
        settings?.website ||
        settings?.website_url ||
        receiptData?.website ||
        "";

    const displayReceiptId =
        receiptId ||
        receiptData?.receipt_id ||
        receiptData?.id ||
        "";

    const paymentMethod =
        receiptData?.payment_method ||
        receiptData?.paymentMethod ||
        "";

    const subtotal =
        receiptData?.subtotal ??
        receiptData?.sub_total ??
        receiptData?.subtotal_amount ??
        null;

    const itemName = (item) =>
        item?.name ??
        item?.item_name ??
        item?.product_name ??
        item?.description ??
        "";

    const itemQuantity = (item) =>
        item?.quantity ??
        item?.qty ??
        1;

    const itemPrice = (item) =>
        item?.price ??
        item?.unit_price ??
        item?.selling_price ??
        null;

    const itemTotal = (item) =>
        item?.total ??
        item?.total_price ??
        item?.amount ??
        null;

    const hasQrImage = Boolean(qrCodeUrl);
    const hasQrPayload = Boolean(checkoutPayloadLink);

    /* ================================================================
       DIGITAL TILL SLIP UI
       ================================================================ */

    return (
        <section className="tech-slip-scene">
            <article className="tech-slip">

                {/* Decorative frame */}
                <div className="tech-slip-frame" aria-hidden="true">
                    <span className="tech-frame-corner tech-frame-tl" />
                    <span className="tech-frame-corner tech-frame-tr" />
                    <span className="tech-frame-corner tech-frame-bl" />
                    <span className="tech-frame-corner tech-frame-br" />
                </div>

                <div className="tech-slip-inner">

                    {/* =================================================
                        BUSINESS HEADER
                        ================================================= */}

                    <header className="tech-slip-header">

                        <div className="tech-slip-brand-visual">
                            <div className="tech-slip-logo-orbit">
                                <span className="tech-orbit-ring ring-one" />
                                <span className="tech-orbit-ring ring-two" />

                                <div className="tech-slip-logo">
                                    {logoUrl ? (
                                        <img
                                            src={logoUrl}
                                            alt="Business logo"
                                        />
                                    ) : (
                                        <svg
                                            viewBox="0 0 100 100"
                                            role="img"
                                            aria-label="Business logo placeholder"
                                        >
                                            <path
                                                d="M50 5 91 28 91 72 50 95 9 72 9 28Z"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            />
                                            <path
                                                d="M50 20 77 35 77 65 50 80 23 65 23 35Z"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                            <path
                                                d="M35 35H55Q70 35 70 47Q70 56 59 58L72 70H57L44 57V70H35Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    )}
                                </div>

                                <span className="tech-logo-cross cross-one" />
                                <span className="tech-logo-cross cross-two" />
                            </div>

                            <div className="tech-slip-logo-caption">
                                <span className="tech-status-dot" />
                                DIGITAL RECEIPT
                            </div>
                        </div>

                        <div className="tech-slip-business">

                            <div className="tech-slip-overline">
                                <span>TRANSACTION DOCUMENT</span>
                                <span className="tech-overline-line" />
                            </div>

                            {businessName && (
                                <h2 className="tech-slip-business-name">
                                    {businessName}
                                </h2>
                            )}

                            <div className="tech-slip-title">
                                <span>TILL</span> SLIP
                            </div>

                            <div className="tech-slip-business-divider">
                                <span />
                            </div>

                            <div className="tech-slip-contact-list">

                                {businessAddress && (
                                    <div className="tech-contact-row">
                                        <span className="tech-contact-icon">
                                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                                                <circle cx="12" cy="10" r="2.5" />
                                            </svg>
                                        </span>
                                        <span>{businessAddress}</span>
                                    </div>
                                )}

                                {businessPhone && (
                                    <div className="tech-contact-row">
                                        <span className="tech-contact-icon">
                                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.7l-1.5 1.5a16 16 0 0 0 5.7 5.7l1.5-1.5a2 2 0 0 1 1.7-.6l3 .5a2 2 0 0 1 1.7 1.9Z" />
                                            </svg>
                                        </span>
                                        <span>{businessPhone}</span>
                                    </div>
                                )}

                                {businessEmail && (
                                    <div className="tech-contact-row">
                                        <span className="tech-contact-icon">
                                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                                <rect x="3" y="5" width="18" height="14" rx="1" />
                                                <path d="m3 7 9 7 9-7" />
                                            </svg>
                                        </span>
                                        <span className="tech-contact-value">
                                            {businessEmail}
                                        </span>
                                    </div>
                                )}

                            </div>
                        </div>
                    </header>

                    {/* =================================================
                        TRANSACTION METADATA
                        ================================================= */}

                    <section className="tech-slip-metadata">
                        <div className="tech-meta-cell">
                            <span className="tech-meta-label">RECEIPT ID</span>
                            <strong>
                                {displayReceiptId || "—"}
                            </strong>
                        </div>

                        <div className="tech-meta-cell">
                            <span className="tech-meta-label">DATE & TIME</span>
                            <strong>{formattedTransactionDate}</strong>
                        </div>

                        <div className="tech-meta-cell">
                            <span className="tech-meta-label">STATUS</span>
                            <strong className="tech-meta-status">
                                <span className="tech-status-dot" />
                                {isExpired ? "EXPIRED" : "RECORDED"}
                            </strong>
                        </div>
                    </section>

                    {/* =================================================
                        ITEMIZED PURCHASES
                        ================================================= */}

                    <section className="tech-slip-items-section">

                        <div className="tech-section-heading">
                            <span className="tech-section-index">01</span>
                            <h3>TRANSACTION ITEMS</h3>
                            <span className="tech-heading-line" />
                        </div>

                        <div className="tech-slip-table-wrap">
                            <table className="tech-slip-table">
                                <thead>
                                    <tr>
                                        <th className="tech-item-heading">ITEM DESCRIPTION</th>
                                        <th className="tech-qty-heading">QTY</th>
                                        <th className="tech-price-heading">PRICE</th>
                                        <th className="tech-total-heading">TOTAL</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {receiptDataItems.map((item, index) => (
                                        <tr
                                            key={
                                                item?.id ??
                                                item?.item_id ??
                                                `${itemName(item)}-${index}`
                                            }
                                        >
                                            <td className="tech-item-name">
                                                <span className="tech-item-marker" />
                                                <span>{itemName(item)}</span>
                                            </td>

                                            <td className="tech-item-qty">
                                                {itemQuantity(item)}
                                            </td>

                                            <td className="tech-item-price">
                                                {itemPrice(item) !== null &&
                                                    itemPrice(item) !== ""
                                                    ? formatCurrency(itemPrice(item))
                                                    : "—"}
                                            </td>

                                            <td className="tech-item-total">
                                                {itemTotal(item) !== null &&
                                                    itemTotal(item) !== ""
                                                    ? formatCurrency(itemTotal(item))
                                                    : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {receiptDataItems.length === 0 && (
                            <div className="tech-slip-empty">
                                <span className="tech-empty-symbol">＋</span>
                                <span>TRANSACTION ITEMS WILL APPEAR HERE</span>
                            </div>
                        )}
                    </section>

                    {/* =================================================
                        QR CODE + TOTALS
                        ================================================= */}

                    <section className="tech-slip-payment-layout">

                        <div className="tech-slip-qr-panel">

                            <div className="tech-section-heading tech-qr-heading">
                                <span className="tech-section-index">02</span>
                                <h3>QR VERIFICATION</h3>
                            </div>

                            <div className="tech-qr-frame">

                                <span className="tech-qr-corner qr-corner-tl" />
                                <span className="tech-qr-corner qr-corner-tr" />
                                <span className="tech-qr-corner qr-corner-bl" />
                                <span className="tech-qr-corner qr-corner-br" />

                                {hasQrImage ? (
                                    <img
                                        className="tech-qr-image"
                                        src={qrCodeUrl}
                                        alt="Receipt verification QR code"
                                    />
                                ) : hasQrPayload ? (
                                    <QRCodeCanvas
                                        value={checkoutPayloadLink}
                                        size={220}
                                        level="H"
                                        marginSize={2}
                                        bgColor="#ffffff"
                                        fgColor="#000000"
                                        title="Scan to verify this receipt"
                                        className="tech-qr-canvas"
                                    />
                                ) : (
                                    <div className="tech-qr-unavailable">
                                        <svg viewBox="0 0 100 100" aria-hidden="true">
                                            <rect x="8" y="8" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" />
                                            <rect x="17" y="17" width="10" height="10" fill="currentColor" />
                                            <rect x="64" y="8" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" />
                                            <rect x="73" y="17" width="10" height="10" fill="currentColor" />
                                            <rect x="8" y="64" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" />
                                            <rect x="17" y="73" width="10" height="10" fill="currentColor" />
                                            <path d="M48 8h8v8h-8zM48 24h8v8h-8zM40 40h8v8h-8zM56 40h8v8h-8zM72 48h8v8h-8zM48 56h8v8h-8zM64 64h8v8h-8zM80 72h8v8h-8zM48 80h8v8h-8zM56 88h8v4h-8z" fill="currentColor" />
                                        </svg>
                                        <span>AWAITING QR DATA</span>
                                    </div>
                                )}

                            </div>

                            <div className="tech-qr-instruction">
                                <span className="tech-qr-scan-icon">⌗</span>
                                SCAN TO VERIFY
                            </div>

                            <div className="tech-qr-reference">
                                {displayReceiptId
                                    ? `REF: ${displayReceiptId}`
                                    : "SECURE RECEIPT REFERENCE"}
                            </div>
                        </div>

                        <div className="tech-slip-totals-panel">

                            <div className="tech-section-heading">
                                <span className="tech-section-index">03</span>
                                <h3>PAYMENT SUMMARY</h3>
                            </div>

                            <div className="tech-total-row">
                                <span>SUBTOTAL</span>
                                <strong>
                                    {subtotal !== null && subtotal !== ""
                                        ? formatCurrency(subtotal)
                                        : "—"}
                                </strong>
                            </div>

                            <div className="tech-total-row">
                                <span>VAT / TAX</span>
                                <strong>
                                    {vat !== null && vat !== ""
                                        ? formatCurrency(vat)
                                        : "—"}
                                </strong>
                            </div>

                            <div className="tech-grand-total">
                                <span>TOTAL</span>
                                <strong>
                                    {total !== ""
                                        ? formatCurrency(total)
                                        : "—"}
                                </strong>
                            </div>

                            <div className="tech-payment-method">
                                <span>PAYMENT METHOD</span>
                                <strong>{paymentMethod || "—"}</strong>
                            </div>

                            {voucher && (
                                <div className="tech-voucher-info">
                                    <span>VOUCHER</span>
                                    <strong>
                                        {voucher?.code ||
                                            voucher?.name ||
                                            "APPLIED"}
                                    </strong>
                                </div>
                            )}

                            {Number(daysRemaining) > 0 && (
                                <div className="tech-validity">
                                    <span>VALIDITY REMAINING</span>
                                    <strong>
                                        {daysRemaining} {Number(daysRemaining) === 1
                                            ? "DAY"
                                            : "DAYS"}
                                    </strong>
                                </div>
                            )}

                            <div className="tech-payment-footer">
                                <span className="tech-footer-mini-line" />
                                TRANSACTION SUMMARY
                                <span className="tech-footer-mini-line" />
                            </div>
                        </div>
                    </section>

                    {/* =================================================
                        AUTHENTICITY FOOTER
                        ================================================= */}

                    <footer className="tech-slip-authenticity">

                        <div className="tech-auth-icon">
                            <svg viewBox="0 0 64 64" aria-hidden="true">
                                <path d="M32 4 53 12V29C53 43 44 53 32 60 20 53 11 43 11 29V12Z" />
                                <path d="m21 31 8 8 15-17" />
                            </svg>
                        </div>

                        <div className="tech-auth-copy">
                            <strong>DIGITAL RECEIPT</strong>
                            <span>
                                Transaction record generated from connected
                                receipt data.
                            </span>
                        </div>

                        <div className="tech-thank-you">
                            <span>THANK YOU</span>
                            <small>FOR YOUR PURCHASE</small>
                        </div>

                    </footer>

                    {businessWebsite && (
                        <div className="tech-slip-website">
                            <span className="tech-website-globe">◎</span>
                            <span>{businessWebsite}</span>
                        </div>
                    )}

                    {/* =================================================
                        DOWNLOAD ACTION
                        ================================================= */}

                    <button
                        type="button"
                        className="tech-slip-download"
                        onClick={handleDownload}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" />
                        </svg>
                        DOWNLOAD RECEIPT
                        <span className="tech-download-arrow">↗</span>
                    </button>

                    {/* Watermark stays behind the receipt content. */}
                    {watermarkUrl && (
                        <img
                            className="tech-slip-watermark"
                            src={watermarkUrl}
                            alt=""
                            aria-hidden="true"
                        />
                    )}

                </div>
            </article>
        </section>
    );
}

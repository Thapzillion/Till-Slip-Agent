import React from "react";
import { QRCodeSVG } from "qrcode.react";
import "./SpaceTillSlip.css";

export default function SpaceTillSlip({
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
                "SpaceTillSlip: onDownload handler was not supplied."
            );
        }
    };

    /* ================================================================
       DISPLAY HELPERS
       These read existing data only; no merchant inputs are created.
       ================================================================ */

    const merchantName =
        settings?.business_name ||
        settings?.merchant_name ||
        receiptData?.business_name ||
        receiptData?.merchant_name ||
        "";

    const merchantAddress =
        settings?.business_address ||
        settings?.address ||
        receiptData?.business_address ||
        receiptData?.address ||
        "";

    const merchantPhone =
        settings?.business_phone ||
        settings?.phone ||
        receiptData?.business_phone ||
        receiptData?.phone ||
        "";

    const merchantWebsite =
        settings?.website ||
        settings?.website_url ||
        receiptData?.website ||
        "";

    const receiptNumber =
        receiptId ||
        receiptData?.receipt_id ||
        receiptData?.receipt_number ||
        receiptData?.id ||
        "";

    const cashier =
        receiptData?.cashier_name ||
        receiptData?.cashier ||
        user?.name ||
        user?.email ||
        "";

    const subtotal =
        receiptData?.subtotal ??
        receiptData?.sub_total ??
        null;

    const discount =
        receiptData?.discount ??
        receiptData?.discount_amount ??
        voucher?.discount_amount ??
        null;

    const taxRate =
        receiptData?.tax_rate ??
        receiptData?.vat_rate ??
        settings?.vat_rate ??
        null;

    const hasValue = (value) =>
        value !== null && value !== undefined && value !== "";

    const getItemName = (item) =>
        item?.name ??
        item?.item_name ??
        item?.description ??
        item?.product_name ??
        "Item";

    const getItemQuantity = (item) =>
        item?.quantity ?? item?.qty ?? 1;

    const getItemPrice = (item) =>
        item?.unit_price ??
        item?.price ??
        item?.amount ??
        "";

    const getItemTotal = (item) =>
        item?.total ??
        item?.line_total ??
        item?.total_price ??
        (Number(getItemQuantity(item)) * Number(getItemPrice(item)));

    const qrSource = String(qrCodeUrl || "").trim();
    const qrSourceLooksLikeImage =
        /^(data:image\/|blob:)/i.test(qrSource) ||
        /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(qrSource);

    // Prefer the actual checkout/receipt payload when generating a QR code.
    // If qrCodeUrl is already a QR image, display it as supplied.
    const qrPayload =
        String(checkoutPayloadLink || "").trim() ||
        (!qrSourceLooksLikeImage ? qrSource : "");

    const hasQrImage = Boolean(qrSource && qrSourceLooksLikeImage);
    const hasQrPayload = Boolean(qrPayload);

    return (
        <section className="space-slip-shell">
            <article className="space-slip" aria-label="Digital till slip">
                <div className="space-slip-frame space-slip-frame-outer" />
                <div className="space-slip-frame space-slip-frame-inner" />

                <div className="space-slip-top-mark" aria-hidden="true">
                    <span className="space-slip-infinity">∞</span>
                </div>

                <div className="space-slip-orbit space-slip-orbit-one" aria-hidden="true" />
                <div className="space-slip-orbit space-slip-orbit-two" aria-hidden="true" />

                <header className="space-slip-header">
                    <p className="space-slip-eyebrow">INFINITY INTERFACE</p>

                    <div className="space-slip-logo-wrap">
                        {logoUrl ? (
                            <img
                                className="space-slip-logo"
                                src={logoUrl}
                                alt={merchantName ? `${merchantName} logo` : "Merchant logo"}
                            />
                        ) : (
                            <div className="space-slip-logo-placeholder" aria-label="Merchant logo will appear here">
                                <span>∞</span>
                            </div>
                        )}
                    </div>

                    {merchantName && (
                        <h2 className="space-slip-merchant-name">{merchantName}</h2>
                    )}

                    <p className="space-slip-tagline">DIGITAL TRANSACTION RECORD</p>

                    <div className="space-slip-title-rule">
                        <span />
                        <h1>TILL SLIP</h1>
                        <span />
                    </div>
                </header>

                <section className="space-slip-meta" aria-label="Merchant and transaction information">
                    <div className="space-slip-merchant-details">
                        {merchantAddress && (
                            <p><span className="space-slip-meta-icon">⌖</span><span>{merchantAddress}</span></p>
                        )}
                        {merchantPhone && (
                            <p><span className="space-slip-meta-icon">◖</span><span>{merchantPhone}</span></p>
                        )}
                        {merchantWebsite && (
                            <p><span className="space-slip-meta-icon">◎</span><span>{merchantWebsite}</span></p>
                        )}
                    </div>

                    <div className="space-slip-transaction-details">
                        <p><span>DATE</span><strong>{formattedTransactionDate}</strong></p>
                        {receiptNumber && (
                            <p><span>RECEIPT</span><strong>{receiptNumber}</strong></p>
                        )}
                        {cashier && (
                            <p><span>CASHIER</span><strong>{cashier}</strong></p>
                        )}
                    </div>
                </section>

                <section className="space-slip-items" aria-label="Purchased items">
                    <div className="space-slip-table-head">
                        <span>ITEM</span>
                        <span>QTY</span>
                        <span>PRICE</span>
                        <span>TOTAL</span>
                    </div>

                    {receiptDataItems.length > 0 ? (
                        <div className="space-slip-item-list">
                            {receiptDataItems.map((item, index) => (
                                <div className="space-slip-item-row" key={item?.id ?? item?.sku ?? index}>
                                    <div className="space-slip-item-name">
                                        <span className="space-slip-item-glyph" aria-hidden="true">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <span>{getItemName(item)}</span>
                                    </div>
                                    <span className="space-slip-item-qty">{getItemQuantity(item)}</span>
                                    <span className="space-slip-item-price">{formatCurrency(getItemPrice(item))}</span>
                                    <span className="space-slip-item-total">{formatCurrency(getItemTotal(item))}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-slip-empty-items">
                            ITEM DETAILS WILL APPEAR HERE WHEN PROVIDED
                        </div>
                    )}
                </section>

                <section className="space-slip-lower">
                    <div className="space-slip-watermark-panel" aria-hidden="true">
                        {watermarkUrl ? (
                            <img src={watermarkUrl} alt="" className="space-slip-watermark-logo" />
                        ) : (
                            <div className="space-slip-planet">
                                <span />
                            </div>
                        )}
                        <div className="space-slip-panel-caption">TRANSACTION VERIFIED</div>
                    </div>

                    <div className="space-slip-totals">
                        {hasValue(subtotal) && (
                            <div className="space-slip-total-line">
                                <span>SUBTOTAL</span>
                                <strong>{formatCurrency(subtotal)}</strong>
                            </div>
                        )}

                        {hasValue(discount) && (
                            <div className="space-slip-total-line">
                                <span>DISCOUNT{voucher?.code ? ` (${voucher.code})` : ""}</span>
                                <strong>
                                    {String(discount).trim().startsWith("-")
                                        ? formatCurrency(discount)
                                        : `-${formatCurrency(discount)}`}
                                </strong>
                            </div>
                        )}

                        {hasValue(vat) && (
                            <div className="space-slip-total-line">
                                <span>TAX{hasValue(taxRate) ? ` (${taxRate}${String(taxRate).includes("%") ? "" : "%"})` : ""}</span>
                                <strong>{formatCurrency(vat)}</strong>
                            </div>
                        )}

                        <div className="space-slip-grand-total">
                            <span>TOTAL</span>
                            <strong>{formatCurrency(total)}</strong>
                        </div>

                        {isExpired && (
                            <p className="space-slip-voucher-status">VOUCHER EXPIRED</p>
                        )}
                        {!isExpired && hasValue(daysRemaining) && daysRemaining > 0 && voucher && (
                            <p className="space-slip-voucher-status">
                                VOUCHER ACTIVE · {daysRemaining} DAY{daysRemaining === 1 ? "" : "S"} REMAINING
                            </p>
                        )}
                    </div>
                </section>

                <section className="space-slip-footer">
                    <div className="space-slip-thanks">
                        <p className="space-slip-thanks-title">THANK YOU</p>
                        <p>FOR YOUR PURCHASE</p>
                        {merchantName && <p className="space-slip-footer-merchant">{merchantName}</p>}
                        <span>∞ &nbsp; STAY LIMITLESS &nbsp; ∞</span>
                    </div>

                    <div className="space-slip-qr-frame">
                        <div className="space-slip-qr-inner">
                            {hasQrPayload ? (
                                <QRCodeSVG
                                    value={qrPayload}
                                    size={168}
                                    level="H"
                                    includeMargin
                                    bgColor="#ffffff"
                                    fgColor="#000000"
                                    title="Scan to open digital receipt"
                                />
                            ) : hasQrImage ? (
                                <img className="space-slip-qr-image" src={qrSource} alt="Receipt QR code" />
                            ) : (
                                <div className="space-slip-qr-placeholder">
                                    <span className="space-slip-qr-symbol">⌗</span>
                                    <span>QR CODE</span>
                                    <small>AWAITING RECEIPT LINK</small>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-slip-scan-copy">
                        <p>SCAN TO VIEW</p>
                        <p>DIGITAL RECEIPT</p>
                        <p>AND TRANSACTION DETAILS</p>
                        <span className="space-slip-mini-orbit" aria-hidden="true">◎</span>
                    </div>
                </section>

                <footer className="space-slip-bottom">
                    <span />
                    <p>POWERED BY DIGITAL RECEIPT TECHNOLOGY</p>
                    <span />
                </footer>

                <div className="space-slip-side-label space-slip-side-label-left" aria-hidden="true">
                    INFINITY POSSIBILITIES
                </div>
                <div className="space-slip-side-label space-slip-side-label-right" aria-hidden="true">
                    SPACE AGE INTERFACE
                </div>
            </article>

            <div className="space-slip-actions">
                <button type="button" className="space-slip-download" onClick={handleDownload}>
                    <span aria-hidden="true">↓</span> DOWNLOAD RECEIPT
                </button>
            </div>
        </section>
    );
}

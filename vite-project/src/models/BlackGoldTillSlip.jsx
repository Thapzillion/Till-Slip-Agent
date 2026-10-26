
import React from "react";
import "./BlackGoldTillSlip.css";

/* ================================================================
   PRESERVED BACKEND LOGIC
   ================================================================ */

export function useBlackGoldTillSlipBackend({
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
                "BlackGoldTillSlip: onDownload handler was not supplied."
            );
        }
    };

    return {
        receiptDataItems,
        total,
        vat,
        transactionDate,
        formattedTransactionDate,
        logoUrl,
        watermarkUrl,
        resolvedCurrencySymbol,
        formatCurrency,
        handleDownload,
    };
}

/* ================================================================
   DISPLAY COMPONENT
   All merchant/receipt details are supplied through props; this
   component deliberately adds no simulator or editable text inputs.
   ================================================================ */

const firstDefined = (...values) =>
    values.find((value) => value !== undefined && value !== null && value !== "");

const itemName = (item) =>
    firstDefined(item?.name, item?.description, item?.product_name, item?.title, "Item");

const itemQuantity = (item) =>
    firstDefined(item?.quantity, item?.qty, 1);

const itemAmount = (item) =>
    firstDefined(item?.total, item?.total_price, item?.amount, item?.subtotal, item?.price, "");

export default function BlackGoldTillSlip(props) {
    const {
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
    } = props;

    const backend = useBlackGoldTillSlipBackend({
        receiptData,
        settings,
        user,
        activeCurrencySymbol,
        voucher,
        isExpired,
        daysRemaining,
        qrCodeUrl,
        checkoutPayloadLink,
        receiptId,
        onDownload,
    });

    const {
        receiptDataItems,
        total,
        vat,
        formattedTransactionDate,
        logoUrl,
        watermarkUrl,
        formatCurrency,
        handleDownload,
    } = backend;

    const businessName = firstDefined(
        receiptData?.business_name,
        settings?.business_name,
        settings?.company_name,
        user?.business_name,
        user?.company_name
    );

    const businessAddress = firstDefined(
        receiptData?.business_address,
        settings?.business_address,
        settings?.address,
        user?.business_address,
        user?.address
    );

    const businessEmail = firstDefined(
        receiptData?.business_email,
        settings?.business_email,
        settings?.email,
        user?.email
    );

    const transactionId = firstDefined(
        receiptData?.transaction_id,
        receiptData?.reference,
        receiptId
    );

    const voucherCode = firstDefined(
        voucher?.code,
        voucher?.voucher_code,
        receiptData?.voucher_code
    );

    const discount = firstDefined(
        voucher?.discount_percentage,
        voucher?.discount,
        receiptData?.discount_percentage
    );

    // If qrCodeUrl is supplied, use it. Otherwise generate a QR image
    // from the checkout payload link. For production, a local QR library
    // such as qrcode.react avoids relying on a third-party QR endpoint.
    const qrImageSrc = qrCodeUrl || (
        checkoutPayloadLink
            ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(checkoutPayloadLink)}`
            : ""
    );

    const currencyTotal = formatCurrency(total);
    const hasVoucher = Boolean(voucher || voucherCode || qrImageSrc);

    return (
        <main className="bgts-page">
            <article className="bgts-card">
                <div className="bgts-topline">
                    <span className="bgts-kicker">DIGITAL RECEIPT</span>
                    <span className="bgts-status"><i /> VERIFIED</span>
                </div>

                <header className="bgts-brand">
                    {logoUrl ? (
                        <img className="bgts-logo" src={logoUrl} alt="Business logo" />
                    ) : (
                        <div className="bgts-monogram" aria-hidden="true">✦</div>
                    )}
                    {businessName && <h1>{businessName}</h1>}
                    <div className="bgts-gold-rule"><span /></div>
                    {businessAddress && <p className="bgts-detail">{businessAddress}</p>}
                    {businessEmail && <p className="bgts-detail bgts-muted">{businessEmail}</p>}
                </header>

                <section className="bgts-transaction" aria-label="Transaction details">
                    <div>
                        <span className="bgts-label">TRANSACTION DATE</span>
                        <strong>{formattedTransactionDate}</strong>
                    </div>
                    {transactionId && (
                        <div className="bgts-transaction-id">
                            <span className="bgts-label">REFERENCE</span>
                            <strong>{transactionId}</strong>
                        </div>
                    )}
                </section>

                <section className="bgts-items">
                    <div className="bgts-section-heading"><span>ITEMS PURCHASED</span></div>
                    {receiptDataItems.length > 0 ? (
                        <div className="bgts-item-list">
                            {receiptDataItems.map((item, index) => (
                                <div className="bgts-item" key={item?.id ?? item?.sku ?? index}>
                                    <span className="bgts-item-index">{String(index + 1).padStart(2, "0")}</span>
                                    <div className="bgts-item-description">
                                        <strong>{itemName(item)}</strong>
                                        {item?.variant && <small>{item.variant}</small>}
                                        {item?.subtitle && <small>{item.subtitle}</small>}
                                        <small>Qty {itemQuantity(item)}</small>
                                    </div>
                                    <span className="bgts-item-price">{formatCurrency(itemAmount(item))}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="bgts-empty">No items available for this transaction.</p>
                    )}
                </section>

                {vat !== null && vat !== undefined && vat !== "" && (
                    <div className="bgts-vat-row">
                        <span>VAT</span>
                        <strong>{formatCurrency(vat)}</strong>
                    </div>
                )}

                <section className="bgts-total">
                    <span>TOTAL DUE</span>
                    <strong>{currencyTotal}</strong>
                </section>

                {hasVoucher && (
                    <section className="bgts-voucher">
                        <div className="bgts-voucher-emblem" aria-hidden="true">✧</div>
                        <p className="bgts-voucher-kicker">A LITTLE SOMETHING EXTRA</p>
                        <h2>{voucherCode ? "YOUR VOUCHER" : "SCAN YOUR VOUCHER"}</h2>

                        {qrImageSrc ? (
                            <div className="bgts-qr-frame">
                                <img src={qrImageSrc} alt="Scannable voucher QR code" />
                            </div>
                        ) : (
                            <div className="bgts-qr-placeholder" role="img" aria-label="QR code will appear when a QR image or checkout link is connected">
                                <span>QR</span>
                                <small>Voucher QR appears when connected</small>
                            </div>
                        )}

                        {voucherCode && <p className="bgts-voucher-code">{voucherCode}</p>}
                        <p className="bgts-voucher-copy">
                            {discount !== undefined
                                ? <>Enjoy <strong>{String(discount).includes("%") ? discount : `${discount}%`}</strong> off your next visit.</>
                                : "Scan to open your voucher or checkout link."}
                        </p>

                        <div className="bgts-voucher-expiry">
                            {isExpired
                                ? "VOUCHER EXPIRED"
                                : daysRemaining > 0
                                    ? <>EXPIRES IN <strong>{daysRemaining} DAYS</strong></>
                                    : voucher?.expires_at
                                        ? <>VALID UNTIL <strong>{new Date(voucher.expires_at).toLocaleDateString("en-GB")}</strong></>
                                        : "VOUCHER DETAILS"}
                        </div>
                    </section>
                )}

                {watermarkUrl && (
                    <div className="bgts-watermark" aria-hidden="true">
                        <img src={watermarkUrl} alt="" />
                    </div>
                )}

                <button type="button" className="bgts-download" onClick={handleDownload}>
                    <span className="bgts-download-icon" aria-hidden="true">↓</span>
                    <span>DOWNLOAD OFFICIAL INVOICE</span>
                    <span className="bgts-download-format">PDF</span>
                </button>

                <footer className="bgts-footer">
                    <span>THANK YOU</span>
                    <span>{transactionId ? `REF · ${transactionId}` : "PLEASE KEEP THIS RECEIPT"}</span>
                </footer>
            </article>
        </main>
    );
}

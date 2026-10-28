
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import "./BlackGoldTillSlip.css";

/* ================================================================
   PRESERVED BACKEND LOGIC
   ================================================================ */

export default function useBlackGoldTillSlipBackend({
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
   BLACK GOLD LUXURY TILL SLIP
   ================================================================ */

export function BlackGoldTillSlip({
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
    const {
        receiptDataItems,
        total,
        vat,
        formattedTransactionDate,
        logoUrl,
        watermarkUrl,
        formatCurrency,
        handleDownload,
    } = useBlackGoldTillSlipBackend({
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

    /* ---------------------------------------------------------------
       Read existing business and transaction data.
       These are data bindings, not simulator inputs.
       --------------------------------------------------------------- */

    const businessName =
        settings?.business_name ??
        settings?.businessName ??
        receiptData?.business_name ??
        receiptData?.businessName ??
        "";

    const businessAddress =
        settings?.business_address ??
        settings?.address ??
        receiptData?.business_address ??
        receiptData?.businessAddress ??
        "";

    const businessEmail =
        settings?.business_email ??
        settings?.email ??
        receiptData?.business_email ??
        receiptData?.businessEmail ??
        user?.email ??
        "";

    const businessPhone =
        settings?.business_phone ??
        settings?.phone ??
        receiptData?.business_phone ??
        receiptData?.businessPhone ??
        "";

    const transactionReference =
        receiptId ??
        receiptData?.receipt_id ??
        receiptData?.receipt_number ??
        receiptData?.transaction_id ??
        "";

    const currencyCode =
        settings?.currency ??
        receiptData?.currency ??
        "";

    /* ---------------------------------------------------------------
       QR CODE SOURCE
       --------------------------------------------------------------- */

    const generatedQrValue =
        checkoutPayloadLink ||
        voucher?.claim_url ||
        voucher?.url ||
        voucher?.code ||
        "";

    const hasQrImage = Boolean(qrCodeUrl);
    const hasGeneratedQr = Boolean(generatedQrValue);
    const hasVoucher = Boolean(voucher || hasQrImage || hasGeneratedQr);

    const voucherDiscount =
        voucher?.discount_percentage ??
        voucher?.discount_percent ??
        voucher?.discount ??
        null;

    const voucherCode = voucher?.code ?? "";

    const voucherExpiry =
        voucher?.expires_at ??
        voucher?.expiry_date ??
        null;

    const voucherExpired =
        Boolean(isExpired) ||
        (voucherExpiry &&
            !Number.isNaN(new Date(voucherExpiry).getTime()) &&
            new Date(voucherExpiry).getTime() < Date.now());

    const expiryText = voucherExpired
        ? "VOUCHER EXPIRED"
        : voucherExpiry
            ? `EXPIRES ${new Date(voucherExpiry).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })}`
            : daysRemaining === 0
                ? "EXPIRES TODAY"
                : `EXPIRES IN ${daysRemaining} ${daysRemaining === 1 ? "DAY" : "DAYS"
                }`;

    return (
        <main className="bg-slip-page">
            <article className="bg-slip">

                {/* Luxury top accent */}
                <div className="bg-slip-topline" />

                {/* HEADER */}
                <header className="bg-slip-header">

                    {logoUrl && (
                        <div className="bg-slip-logo-wrap">
                            <img
                                src={logoUrl}
                                alt="Business logo"
                                className="bg-slip-logo"
                            />
                        </div>
                    )}

                    {businessName && (
                        <h1 className="bg-slip-business-name">
                            {businessName}
                        </h1>
                    )}

                    <div className="bg-slip-heading-rule">
                        <span />
                        <p>OFFICIAL TRANSACTION RECEIPT</p>
                        <span />
                    </div>

                    <div className="bg-slip-meta">
                        <span className="bg-slip-verified">
                            <span className="bg-slip-check">✓</span>
                            VERIFIED TRANSACTION
                        </span>

                        <div className="bg-slip-date">
                            <span className="bg-slip-label">
                                TRANSACTION DATE
                            </span>
                            <time>
                                {formattedTransactionDate}
                            </time>
                        </div>
                    </div>
                </header>

                {/* BUSINESS DETAILS */}
                {(businessAddress || businessEmail || businessPhone) && (
                    <section className="bg-slip-contact">
                        {businessAddress && (
                            <p>
                                <span className="bg-slip-contact-icon">
                                    ◇
                                </span>
                                {businessAddress}
                            </p>
                        )}

                        {businessEmail && (
                            <p>
                                <span className="bg-slip-contact-icon">
                                    ✉
                                </span>
                                <a href={`mailto:${businessEmail}`}>
                                    {businessEmail}
                                </a>
                            </p>
                        )}

                        {businessPhone && (
                            <p>
                                <span className="bg-slip-contact-icon">
                                    ☎
                                </span>
                                <a href={`tel:${businessPhone}`}>
                                    {businessPhone}
                                </a>
                            </p>
                        )}
                    </section>
                )}

                {/* TRANSACTION REFERENCE */}
                {transactionReference && (
                    <div className="bg-slip-reference">
                        <span>RECEIPT REFERENCE</span>
                        <strong>{transactionReference}</strong>
                    </div>
                )}

                {/* ITEMS */}
                <section className="bg-slip-items">
                    <div className="bg-slip-section-heading">
                        <span />
                        <h2>ITEMS PURCHASED</h2>
                        <span />
                    </div>

                    {receiptDataItems.length > 0 ? (
                        <div className="bg-slip-items-list">
                            {receiptDataItems.map((item, index) => {
                                const quantity =
                                    item?.quantity ??
                                    item?.qty ??
                                    1;

                                const itemName =
                                    item?.name ??
                                    item?.item_name ??
                                    item?.description ??
                                    item?.product_name ??
                                    "Item";

                                const itemDescription =
                                    item?.description &&
                                        item?.name &&
                                        item.description !== item.name
                                        ? item.description
                                        : item?.subtitle ?? "";

                                const unitPrice =
                                    item?.price ??
                                    item?.unit_price ??
                                    item?.amount ??
                                    "";

                                const lineTotal =
                                    item?.total ??
                                    item?.line_total ??
                                    item?.subtotal ??
                                    (Number(unitPrice) * Number(quantity));

                                return (
                                    <div
                                        className="bg-slip-item"
                                        key={item?.id ?? item?.item_id ?? index}
                                    >
                                        <div className="bg-slip-item-number">
                                            {String(index + 1).padStart(2, "0")}
                                        </div>

                                        <div className="bg-slip-item-info">
                                            <div className="bg-slip-item-name">
                                                {quantity} × {itemName}
                                            </div>

                                            {itemDescription && (
                                                <div className="bg-slip-item-description">
                                                    {itemDescription}
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-slip-item-price">
                                            {formatCurrency(lineTotal)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-slip-empty">
                            No receipt items available.
                        </div>
                    )}
                </section>

                {/* OPTIONAL VAT */}
                {vat !== null && vat !== undefined && vat !== "" && (
                    <div className="bg-slip-vat">
                        <span>VAT</span>
                        <span>{formatCurrency(vat)}</span>
                    </div>
                )}

                {/* TOTAL */}
                <section className="bg-slip-total">
                    <div>
                        <span className="bg-slip-total-label">
                            TOTAL DUE
                        </span>

                        <span className="bg-slip-total-caption">
                            {currencyCode}
                        </span>
                    </div>

                    <strong>{formatCurrency(total)}</strong>
                </section>

                {/* VOUCHER / QR CODE */}
                {hasVoucher && (
                    <section className="bg-slip-voucher">
                        <div className="bg-slip-voucher-emblem">
                            <svg
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                                fill="none"
                            >
                                <path
                                    d="M24 21V42M24 21H10C5 21 5 11 12 11C19 11 24 21 24 21ZM24 21H38C43 21 43 11 36 11C29 11 24 21 24 21ZM8 23H40V42H8V23Z"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M24 21V8M20 12L24 7L28 12"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <p className="bg-slip-voucher-overline">
                            EXCLUSIVE CUSTOMER PRIVILEGE
                        </p>

                        <h2 className="bg-slip-voucher-title">
                            Your Next Reward
                        </h2>

                        <p className="bg-slip-voucher-subtitle">
                            A special offer, reserved for you.
                        </p>

                        {(hasQrImage || hasGeneratedQr) && (
                            <div className="bg-slip-qr-frame">
                                {hasQrImage ? (
                                    <img
                                        className="bg-slip-qr-image"
                                        src={qrCodeUrl}
                                        alt="Scan to access your voucher"
                                    />
                                ) : (
                                    <QRCodeSVG
                                        value={generatedQrValue}
                                        size={210}
                                        level="H"
                                        marginSize={2}
                                        bgColor="#ffffff"
                                        fgColor="#111111"
                                        title="Scan to access your voucher"
                                    />
                                )}
                            </div>
                        )}

                        {voucherCode && (
                            <div className="bg-slip-voucher-code">
                                <span>VOUCHER CODE</span>
                                <strong>{voucherCode}</strong>
                            </div>
                        )}

                        <h3 className="bg-slip-claim-title">
                            {voucherExpired
                                ? "OFFER NO LONGER AVAILABLE"
                                : "CLAIM YOUR REWARD"}
                        </h3>

                        <p className="bg-slip-voucher-description">
                            {voucherDiscount !== null &&
                                voucherDiscount !== undefined
                                ? `Enjoy ${voucherDiscount}% off your next eligible purchase.`
                                : "Scan the QR code to access your exclusive offer."}
                        </p>

                        <div
                            className={`bg-slip-expiry ${voucherExpired
                                    ? "bg-slip-expiry--expired"
                                    : ""
                                }`}
                        >
                            {expiryText}
                        </div>
                    </section>
                )}

                {/* FOOTER */}
                <footer className="bg-slip-footer">
                    <div className="bg-slip-footer-brand">
                        <span className="bg-slip-footer-line" />
                        <span>THANK YOU FOR YOUR BUSINESS</span>
                        <span className="bg-slip-footer-line" />
                    </div>

                    {transactionReference && (
                        <p className="bg-slip-footer-reference">
                            REF. {transactionReference}
                        </p>
                    )}

                    <button
                        type="button"
                        className="bg-slip-download"
                        onClick={handleDownload}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            fill="none"
                        >
                            <path
                                d="M12 3V15M7 10L12 15L17 10M4 17V21H20V17"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <span>DOWNLOAD OFFICIAL INVOICE PDF</span>
                    </button>
                </footer>

                {/* Decorative watermark, behind the receipt content */}
                {watermarkUrl && (
                    <div className="bg-slip-watermark" aria-hidden="true">
                        <img src={watermarkUrl} alt="" />
                    </div>
                )}
            </article>
        </main>
    );
}

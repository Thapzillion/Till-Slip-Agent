import React from "react";
import "./CyberTillSlip.css";

export default function CyberTillSlip({
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

        if (
            resolvedCurrencySymbol &&
            raw.startsWith(resolvedCurrencySymbol)
        ) {
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
                "CyberTillSlip: onDownload handler was not supplied."
            );
        }
    };

    /* ================================================================
       DYNAMIC DISPLAY VALUES
       ================================================================ */

    // These values are read from existing data only.
    // No business details are hardcoded or requested through new inputs.

    const businessName =
        settings?.business_name ||
        settings?.company_name ||
        receiptData?.business_name ||
        receiptData?.company_name ||
        "";

    const companyAddress =
        settings?.company_address ||
        settings?.business_address ||
        settings?.address ||
        receiptData?.company_address ||
        receiptData?.business_address ||
        receiptData?.address ||
        "";

    const currencyCode =
        settings?.currency ||
        receiptData?.currency ||
        "ZAR";

    const receiptReference =
        receiptId ||
        receiptData?.receipt_id ||
        receiptData?.id ||
        "";

    const qrSource = qrCodeUrl || "";

    const discount =
        receiptData?.discount ??
        receiptData?.discount_amount ??
        null;

    const showVoucher =
        voucher &&
        typeof voucher === "object" &&
        Object.keys(voucher).length > 0;

    const showVat =
        vat !== null &&
        vat !== undefined &&
        vat !== "";

    const showDiscount =
        discount !== null &&
        discount !== undefined &&
        discount !== "";

    /* ================================================================
       RECEIPT INTERFACE
       ================================================================ */

    return (
        <section className="cyber-slip-shell">
            <article className="cyber-slip">

                {/* Animated edge lighting */}
                <div
                    className="cyber-slip-edge"
                    aria-hidden="true"
                />

                {/* Header */}
                <header className="cyber-slip-header">

                    <div className="cyber-slip-brand">

                        {logoUrl && (
                            <div className="cyber-slip-logo-frame">
                                <img
                                    src={logoUrl}
                                    alt={
                                        businessName
                                            ? `${businessName} logo`
                                            : "Business logo"
                                    }
                                    className="cyber-slip-logo"
                                />
                            </div>
                        )}

                        {businessName && (
                            <h2 className="cyber-slip-business-name">
                                {businessName}
                            </h2>
                        )}

                        {companyAddress && (
                            <address className="cyber-slip-address">
                                {companyAddress}
                            </address>
                        )}

                    </div>

                    <div className="cyber-slip-status">
                        <span className="cyber-status-light" />
                        <span>TRANSACTION RECORD</span>
                    </div>

                    <div className="cyber-slip-title-block">
                        <span className="cyber-slip-overline">
                            DIGITAL TRANSACTION
                        </span>

                        <h1 className="cyber-slip-title">
                            TILL SLIP
                        </h1>

                        <div className="cyber-slip-title-line" />
                    </div>

                </header>

                {/* Transaction metadata */}
                <section className="cyber-slip-meta">
                    <div className="cyber-meta-cell">
                        <span className="cyber-meta-label">
                            TRANSACTION DATE
                        </span>

                        <time
                            className="cyber-meta-value"
                            dateTime={transactionDate.toISOString()}
                        >
                            {formattedTransactionDate}
                        </time>
                    </div>

                    {receiptReference !== "" && (
                        <div className="cyber-meta-cell">
                            <span className="cyber-meta-label">
                                RECEIPT REFERENCE
                            </span>

                            <span className="cyber-meta-value cyber-reference">
                                {String(receiptReference)}
                            </span>
                        </div>
                    )}

                    <div className="cyber-meta-cell">
                        <span className="cyber-meta-label">
                            CURRENCY
                        </span>

                        <span className="cyber-meta-value">
                            {currencyCode}
                        </span>
                    </div>
                </section>

                {/* Items */}
                <section className="cyber-slip-items">
                    <div className="cyber-section-heading">
                        <span className="cyber-heading-indicator" />
                        <h3>TRANSACTION ITEMS</h3>
                        <span className="cyber-heading-line" />
                    </div>

                    <div className="cyber-items-header">
                        <span>DESCRIPTION</span>
                        <span className="cyber-quantity-heading">QTY</span>
                        <span className="cyber-amount-heading">
                            AMOUNT
                        </span>
                    </div>

                    {receiptDataItems.length > 0 ? (
                        <div className="cyber-items-list">
                            {receiptDataItems.map((item, index) => {
                                const itemName =
                                    item?.name ??
                                    item?.item_name ??
                                    item?.description ??
                                    item?.product_name ??
                                    "";

                                const quantity =
                                    item?.quantity ??
                                    item?.qty ??
                                    1;

                                const itemTotal =
                                    item?.total ??
                                    item?.total_price ??
                                    item?.line_total ??
                                    item?.amount ??
                                    (
                                        item?.price !== undefined
                                            ? Number(item.price) *
                                            Number(quantity)
                                            : item?.unit_price !== undefined
                                                ? Number(item.unit_price) *
                                                Number(quantity)
                                                : ""
                                    );

                                return (
                                    <div
                                        className="cyber-item-row"
                                        key={
                                            item?.id ??
                                            item?.item_id ??
                                            `${String(itemName)}-${index}`
                                        }
                                    >
                                        <div className="cyber-item-description">
                                            <span className="cyber-item-index">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>

                                            <span className="cyber-item-name">
                                                {itemName}
                                            </span>
                                        </div>

                                        <span className="cyber-item-quantity">
                                            {quantity}
                                        </span>

                                        <span className="cyber-item-amount">
                                            {formatCurrency(itemTotal)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="cyber-items-empty">
                            No transaction items available.
                        </div>
                    )}
                </section>

                {/* Totals */}
                <section className="cyber-slip-totals">
                    {showDiscount && (
                        <div className="cyber-total-row">
                            <span>Discount</span>
                            <span className="cyber-discount-value">
                                − {formatCurrency(discount)}
                            </span>
                        </div>
                    )}

                    {showVat && (
                        <div className="cyber-total-row">
                            <span>VAT</span>
                            <span>{formatCurrency(vat)}</span>
                        </div>
                    )}

                    <div className="cyber-grand-total">
                        <div className="cyber-grand-total-label">
                            <span>TOTAL</span>
                            <small>FINAL TRANSACTION AMOUNT</small>
                        </div>

                        <strong>
                            {formatCurrency(total)}
                        </strong>
                    </div>
                </section>

                {/* Compact verification and QR panel */}
                <section className="cyber-slip-verification">
                    <div className="cyber-verification-copy">
                        <span className="cyber-verification-kicker">
                            DIGITAL VERIFICATION
                        </span>

                        <h3>Receipt access</h3>

                        <p>
                            Scan the QR code to access the linked
                            transaction information.
                        </p>

                        {checkoutPayloadLink && (
                            <a
                                className="cyber-verification-link"
                                href={checkoutPayloadLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Open transaction link
                            </a>
                        )}
                    </div>

                    {qrSource && (
                        <div className="cyber-qr-frame">
                            <img
                                src={qrSource}
                                alt="Transaction verification QR code"
                                className="cyber-qr-image"
                            />

                            <span className="cyber-qr-caption">
                                SCAN TO VERIFY
                            </span>
                        </div>
                    )}
                </section>

                {/* Optional voucher and expiry information */}
                {(showVoucher || isExpired || daysRemaining > 0) && (
                    <section className="cyber-slip-extra">
                        {showVoucher && (
                            <div className="cyber-extra-row">
                                <span>Voucher</span>
                                <span>
                                    {voucher?.code ??
                                        voucher?.voucher_code ??
                                        voucher?.name ??
                                        ""}
                                </span>
                            </div>
                        )}

                        {isExpired && (
                            <div className="cyber-expiry-notice">
                                This voucher has expired.
                            </div>
                        )}

                        {!isExpired && daysRemaining > 0 && (
                            <div className="cyber-extra-row">
                                <span>Voucher validity</span>
                                <span>
                                    {daysRemaining} day
                                    {daysRemaining === 1 ? "" : "s"} remaining
                                </span>
                            </div>
                        )}
                    </section>
                )}

                {/* Download */}
                <footer className="cyber-slip-footer">
                    <button
                        type="button"
                        className="cyber-download-button"
                        onClick={handleDownload}
                    >
                        <svg
                            className="cyber-download-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M12 3V15M7 10L12 15L17 10M4 17V20H20V17"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <span>DOWNLOAD TILL SLIP</span>

                        <span className="cyber-button-arrow">↗</span>
                    </button>

                    <div className="cyber-slip-footer-line">
                        <span />
                        <span className="cyber-footer-diamond" />
                        <span />
                    </div>
                </footer>

                {/* Optional background watermark */}
                {watermarkUrl && (
                    <div
                        className="cyber-slip-watermark"
                        style={{
                            backgroundImage: `url("${watermarkUrl}")`,
                        }}
                        aria-hidden="true"
                    />
                )}

            </article>
        </section>
    );
}

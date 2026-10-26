import React from "react";
import { QRCodeSVG } from "qrcode.react";
import "./LuxuryTillSlip.css";

/* ================================================================
   PRESERVED BACKEND LOGIC
   ================================================================ */

export function useLuxuryTillSlipBackend({
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
                "LuxuryTillSlip: onDownload handler was not supplied."
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
   LUXURY DIGITAL TILL SLIP
   ================================================================ */

export default function LuxuryTillSlip(props) {
    const {
        receiptData = {},
        settings = {},
        user = null,
        qrCodeUrl = "",
        checkoutPayloadLink = "",
        receiptId = null,
        voucher = null,
        isExpired = false,
        daysRemaining = 0,
    } = props;

    const {
        receiptDataItems,
        total,
        vat,
        formattedTransactionDate,
        logoUrl,
        watermarkUrl,
        formatCurrency,
        handleDownload,
    } = useLuxuryTillSlipBackend(props);

    /* All merchant information comes from connected data. */
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
        "";

    const merchantPhone =
        settings?.business_phone ||
        settings?.phone ||
        receiptData?.business_phone ||
        "";

    const merchantEmail =
        settings?.business_email ||
        settings?.email ||
        receiptData?.business_email ||
        "";

    const website =
        settings?.website ||
        settings?.website_url ||
        "";

    const paymentMethod =
        receiptData?.payment_method ||
        receiptData?.paymentMethod ||
        "";

    const receiptNumber =
        receiptData?.receipt_number ||
        receiptData?.receipt_no ||
        receiptData?.invoice_number ||
        receiptId ||
        "";

    const subtotal =
        receiptData?.subtotal ??
        receiptData?.sub_total ??
        null;

    const discount =
        receiptData?.discount ??
        receiptData?.discount_amount ??
        null;

    const currencyTotal = formatCurrency(total);

    /*
     * Prefer the supplied QR image URL.
     * Otherwise generate a real QR code from the checkout payload.
     * A receipt ID alone is not treated as a checkout URL.
     */
    const qrPayload =
        typeof checkoutPayloadLink === "string"
            ? checkoutPayloadLink.trim()
            : "";

    const hasQrImage =
        typeof qrCodeUrl === "string" &&
        qrCodeUrl.trim().length > 0;

    const hasQrPayload = qrPayload.length > 0;

    const getItemName = (item) =>
        item?.name ??
        item?.description ??
        item?.product_name ??
        item?.title ??
        "Item";

    const getItemQuantity = (item) =>
        item?.quantity ??
        item?.qty ??
        1;

    const getItemPrice = (item) =>
        item?.price ??
        item?.unit_price ??
        item?.amount ??
        "";

    const getItemTotal = (item) =>
        item?.total ??
        item?.total_price ??
        item?.line_total ??
        item?.amount ??
        "";

    const showSummaryValue = (value) =>
        value !== null &&
        value !== undefined &&
        value !== "";

    return (
        <section className="luxury-slip-scene">
            <article className="luxury-slip">

                {/* Decorative borders and corners */}
                <div className="luxury-slip-frame" aria-hidden="true" />
                <div className="luxury-slip-corner luxury-slip-corner-tl" />
                <div className="luxury-slip-corner luxury-slip-corner-tr" />
                <div className="luxury-slip-corner luxury-slip-corner-bl" />
                <div className="luxury-slip-corner luxury-slip-corner-br" />

                {/* Optional subtle merchant watermark */}
                {watermarkUrl && (
                    <img
                        className="luxury-slip-watermark"
                        src={watermarkUrl}
                        alt=""
                        aria-hidden="true"
                    />
                )}

                {/* Merchant crest and branding */}
                <header className="luxury-slip-header">
                    <div className="luxury-slip-crest">
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt={merchantName || "Merchant logo"}
                                className="luxury-slip-logo"
                            />
                        ) : (
                            <div
                                className="luxury-slip-empty-crest"
                                aria-hidden="true"
                            >
                                <span>✦</span>
                            </div>
                        )}
                    </div>

                    {merchantName && (
                        <h2 className="luxury-slip-merchant">
                            {merchantName}
                        </h2>
                    )}

                    <p className="luxury-slip-brand-caption">
                        PREMIUM DIGITAL RECEIPT
                    </p>

                    <div className="luxury-slip-thank-you">
                        Thank you for your purchase
                    </div>

                    <div className="luxury-slip-ornament" aria-hidden="true">
                        <span />
                        <b>◇</b>
                        <span />
                    </div>
                </header>

                {/* Transaction details */}
                <section className="luxury-slip-meta">
                    <div>
                        <span className="luxury-slip-label">TILL SLIP</span>
                        <p>{formattedTransactionDate}</p>
                    </div>

                    <div className="luxury-slip-meta-right">
                        <span className="luxury-slip-label">RECEIPT NO.</span>
                        <p>{receiptNumber || "—"}</p>
                    </div>
                </section>

                <div className="luxury-slip-rule" />

                {/* Itemised purchases */}
                <section className="luxury-slip-items">
                    <div className="luxury-slip-table-head">
                        <span>ITEM</span>
                        <span>QTY</span>
                        <span>PRICE</span>
                        <span>TOTAL</span>
                    </div>

                    {receiptDataItems.length > 0 ? (
                        receiptDataItems.map((item, index) => (
                            <div
                                className="luxury-slip-item"
                                key={item?.id ?? item?.item_id ?? index}
                            >
                                <span className="luxury-slip-item-name">
                                    {getItemName(item)}
                                </span>

                                <span className="luxury-slip-item-qty">
                                    {getItemQuantity(item)}
                                </span>

                                <span className="luxury-slip-item-price">
                                    {formatCurrency(getItemPrice(item))}
                                </span>

                                <span className="luxury-slip-item-total">
                                    {formatCurrency(getItemTotal(item))}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="luxury-slip-empty-items">
                            No items available
                        </div>
                    )}
                </section>

                <div className="luxury-slip-rule luxury-slip-items-bottom" />

                {/* Totals */}
                <section className="luxury-slip-totals">
                    {showSummaryValue(subtotal) && (
                        <div className="luxury-slip-summary-row">
                            <span>SUBTOTAL</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                    )}

                    {showSummaryValue(discount) && (
                        <div className="luxury-slip-summary-row">
                            <span>DISCOUNT</span>
                            <span>
                                {String(discount).trim().startsWith("-")
                                    ? formatCurrency(discount)
                                    : `−${formatCurrency(discount)}`}
                            </span>
                        </div>
                    )}

                    {showSummaryValue(vat) && (
                        <div className="luxury-slip-summary-row">
                            <span>VAT</span>
                            <span>{formatCurrency(vat)}</span>
                        </div>
                    )}

                    <div className="luxury-slip-total">
                        <span>TOTAL</span>
                        <strong>{currencyTotal || "—"}</strong>
                    </div>
                </section>

                <div className="luxury-slip-ornament luxury-slip-total-ornament">
                    <span />
                    <b>◇</b>
                    <span />
                </div>

                {/* Payment, QR and merchant details */}
                <section className="luxury-slip-bottom">

                    <div className="luxury-slip-payment">
                        <span className="luxury-slip-label">
                            PAYMENT METHOD
                        </span>

                        <p>{paymentMethod || "—"}</p>

                        {receiptData?.payment_reference && (
                            <div className="luxury-slip-small-detail">
                                REFERENCE: {receiptData.payment_reference}
                            </div>
                        )}

                        {receiptData?.authorization_code && (
                            <div className="luxury-slip-small-detail">
                                AUTH CODE: {receiptData.authorization_code}
                            </div>
                        )}

                        {voucher && (
                            <div className="luxury-slip-voucher">
                                {voucher?.code || "Voucher applied"}
                            </div>
                        )}

                        {isExpired && (
                            <div className="luxury-slip-expiry">
                                Voucher expired
                            </div>
                        )}

                        {!isExpired && daysRemaining > 0 && (
                            <div className="luxury-slip-small-detail">
                                {daysRemaining} day
                                {daysRemaining === 1 ? "" : "s"} remaining
                            </div>
                        )}

                        {user?.email && (
                            <div className="luxury-slip-small-detail">
                                {user.email}
                            </div>
                        )}
                    </div>

                    <div className="luxury-slip-qr-column">
                        <div className="luxury-slip-qr">
                            {hasQrImage ? (
                                <img
                                    src={qrCodeUrl}
                                    alt="Scan QR code"
                                    className="luxury-slip-qr-image"
                                />
                            ) : hasQrPayload ? (
                                <QRCodeSVG
                                    value={qrPayload}
                                    size={144}
                                    level="H"
                                    marginSize={2}
                                    bgColor="#ffffff"
                                    fgColor="#080808"
                                    title="Scan to access receipt or checkout"
                                    className="luxury-slip-qr-svg"
                                />
                            ) : (
                                <div className="luxury-slip-qr-unavailable">
                                    QR CODE
                                    <span>AWAITING DATA</span>
                                </div>
                            )}
                        </div>

                        <span className="luxury-slip-qr-caption">
                            SCAN TO VERIFY
                        </span>
                        <span className="luxury-slip-qr-subcaption">
                            YOUR PURCHASE
                        </span>
                    </div>

                    <div className="luxury-slip-contact">
                        {merchantAddress && (
                            <div className="luxury-slip-contact-block">
                                <span className="luxury-slip-contact-icon">
                                    ◈
                                </span>
                                <p>{merchantAddress}</p>
                            </div>
                        )}

                        {merchantPhone && (
                            <div className="luxury-slip-contact-block">
                                <span className="luxury-slip-contact-icon">
                                    ☎
                                </span>
                                <p>{merchantPhone}</p>
                            </div>
                        )}

                        {merchantEmail && (
                            <div className="luxury-slip-contact-block">
                                <span className="luxury-slip-contact-icon">
                                    ✉
                                </span>
                                <p>{merchantEmail}</p>
                            </div>
                        )}

                        {website && (
                            <div className="luxury-slip-contact-block">
                                <span className="luxury-slip-contact-icon">
                                    ◎
                                </span>
                                <p>{website}</p>
                            </div>
                        )}
                    </div>
                </section>

                <footer className="luxury-slip-footer">
                    <div className="luxury-slip-footer-emblem">♛</div>
                    <p>LUXURY IS IN THE DETAILS</p>
                </footer>

                <button
                    type="button"
                    className="luxury-slip-download"
                    onClick={handleDownload}
                >
                    <span aria-hidden="true">↓</span>
                    DOWNLOAD RECEIPT
                </button>
            </article>
        </section>
    );
}

export const ReceiptTemplate = ({ data, settings }) => {
  return (
    <div className="receipt-container">
      {/* Header with Business Branding */}
      <header className="receipt-header">
        <h2>{settings.business_name || "Business Name"}</h2>
        <p className="address">{settings.store_address}</p>
      </header>

      <hr className="divider" />

      {/* Transaction Details */}
      <div className="receipt-body">
        <p><strong>Customer:</strong> {data.customer_email}</p>
        <div className="item-list">
          {data.items?.map((item, index) => (
            <div key={index} className="item-row">
              <span>{item.name}</span>
              <span>R{item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Financial Breakdown */}
      <footer className="receipt-footer">
        <div className="total-row">
          <span>Subtotal:</span>
          <span>R{data.total_amount.toFixed(2)}</span>
        </div>
        <div className="discount-row">
          <span>Next Order Discount:</span>
          <span>{settings.discount_percentage}% Off</span>
        </div>
        <p className="custom-msg">{settings.custom_message}</p>
        <p className="footer-note">Thank you for your support!</p>
      </footer>
    </div>
  );
};
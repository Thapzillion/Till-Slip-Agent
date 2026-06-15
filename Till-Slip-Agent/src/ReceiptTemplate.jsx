export const ReceiptTemplate = ({ data, settings }) => {

const [activeInboxesCount, setActiveInboxesCount] = useState(2); 
const [totalParsedCount, setTotalParsedCount] = useState(145);
const [selectedDateRangeLabel, setSelectedDateRangeLabel] = useState("PAST_30_DAYS");
const [inboxGraphData, setInboxGraphData] = useState([10, 20, 15, 40, 60, 30, 80, 45, 90, 10, 0, 5, 25, 45, 12, 67, 34, 89, 90, 12, 45, 67, 23, 78, 89, 90, 23, 95]);
const [parsingSuccessRate, setParsingSuccessRate] = useState(98.7);

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
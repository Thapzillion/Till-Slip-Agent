import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function RedeemView() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // Interface State Variables
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [couponData, setCouponData] = useState({ code: '', discount: 0, storeName: '' });

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Invalid URL Payload: Security token trace parameter missing.');
      return;
    }
    
    verifyAndIncentivizeVoucher();
  }, [token]);

  const verifyAndIncentivizeVoucher = async () => {
    try {
      // Point this directly to your live deployed Supabase Edge Function route frame
      const response = await fetch(
        `https://agadjvdhqguunowplbak.functions.supabase.co/receipt-agent`, //
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticketId: searchParams.get('ticketId') || '', // Optional backup mapping payload
            voucherToken: token,
            customerEmail: searchParams.get('email') || ''
          })
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Voucher validation sweep rejected.');
      }

      // Populate success node state elements
      setCouponData({
        code: result.couponCode || 'CLAIMED_SUCCESSFULLY',
        discount: result.discountValue || 10,
        storeName: result.storeName || 'Partner Merchant'
      });
      setStatus('success');

    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Server connection timed out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-[#e2e8f0] flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Premium Neumorphic Branding Header Frame */}
      <div className="mb-8 text-center">
        <h1 className="text-xs font-bold tracking-[0.3em] text-[#14b8a6] uppercase mb-2">
          ⚡ Ruach Agent Authentication Core
        </h1>
        <p className="text-xs text-[#64748b]">Decoupled Micro-Token Verification Node</p>
      </div>

      {/* Main Interactive Application Container Frame */}
      <div className="w-full max-w-md bg-[#11161d] rounded-2xl p-8 border border-[#1e293b]/50 shadow-[8px_8px_16px_#06080b,-8px_-8px_16px_#1c2430]">
        
        {/* STATE 1: RECONCILING & LOADING */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-12 h-12 border-4 border-[#14b8a6] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-[#94a3b8] font-medium tracking-wide">
              Decrypting validation hash payload...
            </p>
          </div>
        )}

        {/* STATE 2: SUCCESSFUL RECONCILIATION */}
        {status === 'success' && (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#14b8a6]/10 text-[#14b8a6] border border-[#14b8a6]/30 mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Voucher Verified!</h2>
              <p className="text-xs text-[#94a3b8] mt-1">
                Your single-use cart coupon balance is active.
              </p>
            </div>

            {/* Premium Interactive Neumorphic Coupon Plate */}
            <div className="bg-[#0b0f14] rounded-xl p-5 border border-[#1e293b] shadow-inner space-y-2">
              <span className="text-xs font-bold text-[#64748b] tracking-wider block uppercase">
                Checkout Discount Code
              </span>
              <div className="text-lg font-mono font-black text-white tracking-widest bg-[#11161d] py-3 px-4 rounded-lg border border-[#14b8a6]/20 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5)] select-all">
                {couponData.code}
              </div>
              <p className="text-xs text-[#14b8a6] font-semibold pt-1">
                🎉 Save {couponData.discount}% off at checkout
              </p>
            </div>

            {/* Direct Redirect Call to Action Routing Anchor */}
            <button 
              onClick={() => window.location.href = `https://till-slip-agent.vercel.app/checkout?code=${couponData.code}`}
              className="w-full bg-[#14b8a6] hover:bg-[#0d9488] text-[#0b0f14] font-bold text-xs tracking-widest py-4 px-6 rounded-xl transition-all duration-300 shadow-[4px_4px_10px_rgba(20,184,166,0.2)] uppercase"
            >
              Apply Discount & Go to Cart
            </button>
          </div>
        )}

        {/* STATE 3: FAILED VERIFICATION / EXPIRED PARM LIMIT */}
        {status === 'error' && (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Redemption Failure</h2>
              <p className="text-xs text-red-400/80 mt-1.5 px-4 font-mono leading-relaxed bg-red-950/20 py-2 rounded-lg border border-red-500/10">
                {errorMessage}
              </p>
            </div>

            <div className="text-xs text-[#64748b] leading-relaxed pt-2">
              Vouchers are strictly limited to single-use parameters. If you have already processed this checkout coupon transaction balance, check your storefront dashboard.
            </div>

            <button 
              onClick={() => setStatus('loading') || verifyAndIncentivizeVoucher()}
              className="w-full bg-transparent hover:bg-[#1e293b]/30 text-[#94a3b8] border border-[#1e293b] font-semibold text-xs tracking-wider py-3.5 px-6 rounded-xl transition-all duration-200"
            >
              Retry Token Verification Sweep
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
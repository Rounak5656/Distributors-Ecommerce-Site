"use client";

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  QrCode, 
  Smartphone, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  ArrowRight,
  Sparkles,
  Download,
  Clock
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
}

interface IndiaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  gstAmount: number;
  total: number;
  onPaymentSuccess: () => void;
}

export default function IndiaPaymentModal({
  isOpen,
  onClose,
  items,
  subtotal,
  gstAmount,
  total,
  onPaymentSuccess,
}: IndiaPaymentModalProps) {
  const [activeTab, setActiveTab] = useState<'upi' | 'cod' | 'emi' | 'card'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('gpay');
  const [codStep, setCodStep] = useState<'request' | 'verify' | 'confirmed'>('request');
  const [otpCode, setOtpCode] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  if (!isOpen) return null;

  const upiId = 'kailashelectronics@icici';

  const triggerCelebration = (confirmedId: string) => {
    setOrderId(confirmedId);
    setOrderConfirmed(true);
    setIsProcessing(false);
    onPaymentSuccess();

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (_) {}
  };

  const handlePayViaUpi = (app: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedId = `KE-${Math.floor(100000 + Math.random() * 900000)}`;
      triggerCelebration(generatedId);
    }, 1500);
  };

  const handleVerifyCodOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length === 4) {
      setIsProcessing(true);
      setTimeout(() => {
        const generatedId = `COD-${Math.floor(100000 + Math.random() * 900000)}`;
        triggerCelebration(generatedId);
      }, 1200);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                100% Encrypted Gateway
              </span>
              <span className="text-neutral-500 text-xs">|</span>
              <span className="text-neutral-400 text-xs font-mono">GST Compliant</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mt-1">
              {orderConfirmed ? 'Order Confirmed!' : 'Express Checkout & Indian Payment Gateway'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ORDER SUCCESS SCREEN */}
        {orderConfirmed ? (
          <div className="p-6 md:p-8 overflow-y-auto text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-2xl font-extrabold text-white">Payment Received Successfully</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Your order is being prepped for dispatch from our Central India warehouse.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Order Reference:</span>
                <span className="font-mono font-bold text-cyan-400">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Amount Paid (Inc. GST):</span>
                <span className="font-semibold text-white">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Dispatch Logistics:</span>
                <span className="text-emerald-400 font-medium">Blue Dart Express (Air Cargo)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">GST Invoice:</span>
                <span className="text-white">Generated (GSTR-1 compliant)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  alert(`Downloading Official GST Invoice for Order ${orderId}...`);
                }}
                className="flex-1 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors border border-neutral-700"
              >
                <Download className="w-4 h-4" />
                Download Tax Invoice PDF
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                Return to Store
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM BODY */
          <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
            {/* AMOUNT SUMMARY PILL */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-neutral-950 to-neutral-900 border border-neutral-800">
              <div>
                <span className="text-[11px] text-neutral-400 block uppercase tracking-wider">Total Order Value</span>
                <span className="text-xl md:text-2xl font-extrabold text-white">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-right text-[11px] text-neutral-400">
                <span>Includes ₹{gstAmount.toLocaleString('en-IN')} GST</span>
                <span className="block text-emerald-400 font-semibold">Free Pan-India Freight</span>
              </div>
            </div>

            {/* PAYMENT METHOD TABS */}
            <div className="grid grid-cols-4 gap-2 border-b border-neutral-800 pb-3">
              <button
                onClick={() => setActiveTab('upi')}
                className={`py-2 px-1 text-center text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'upi'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4 mx-auto mb-1" />
                UPI & QR
              </button>
              <button
                onClick={() => setActiveTab('cod')}
                className={`py-2 px-1 text-center text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'cod'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Truck className="w-4 h-4 mx-auto mb-1" />
                COD + OTP
              </button>
              <button
                onClick={() => setActiveTab('emi')}
                className={`py-2 px-1 text-center text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'emi'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4 mx-auto mb-1" />
                No-Cost EMI
              </button>
              <button
                onClick={() => setActiveTab('card')}
                className={`py-2 px-1 text-center text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'card'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1" />
                Cards / Net
              </button>
            </div>

            {/* TAB CONTENT 1: UPI & QR */}
            {activeTab === 'upi' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-2.5">
                    Select 1-Click UPI Mobile App
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'gpay', name: 'Google Pay', color: 'border-blue-500/40' },
                      { id: 'phonepe', name: 'PhonePe', color: 'border-purple-500/40' },
                      { id: 'paytm', name: 'Paytm UPI', color: 'border-sky-500/40' },
                      { id: 'cred', name: 'CRED UPI', color: 'border-amber-500/40' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        onClick={() => setSelectedUpiApp(app.id)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          selectedUpiApp === app.id
                            ? `${app.color} bg-white/5 text-white shadow-md ring-1 ring-cyan-500/50`
                            : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <span className="text-xs font-bold block">{app.name}</span>
                        <span className="text-[10px] text-emerald-400">1-Tap Intent</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* DYNAMIC QR CODE DISPLAY */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <div className="p-3 bg-white rounded-2xl w-32 h-32 flex items-center justify-center shrink-0 shadow-lg">
                    {/* Simulated SVG QR code */}
                    <div className="w-24 h-24 bg-neutral-900 rounded p-1 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="w-5 h-5 bg-white rounded-sm" />
                        <div className="w-5 h-5 bg-white rounded-sm" />
                      </div>
                      <div className="flex justify-center items-center text-[8px] text-cyan-400 font-mono">
                        UPI QR
                      </div>
                      <div className="flex justify-between">
                        <div className="w-5 h-5 bg-white rounded-sm" />
                        <div className="w-3 h-3 bg-emerald-400 rounded-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-center sm:text-left">
                    <span className="text-xs font-bold text-white block">Scan & Pay with Any Indian UPI App</span>
                    <p className="text-[11px] text-neutral-400">
                      Supports BHIM, GPay, PhonePe, Paytm, Amazon Pay, or any bank mobile app.
                    </p>
                    <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                      <code className="text-xs bg-neutral-900 border border-neutral-700 px-2.5 py-1 rounded-lg text-cyan-300 font-mono">
                        {upiId}
                      </code>
                      <button
                        onClick={copyUpiId}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handlePayViaUpi(selectedUpiApp)}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-black font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Connecting to Bank UPI Gateway...
                    </span>
                  ) : (
                    <>
                      Pay ₹{total.toLocaleString('en-IN')} via {selectedUpiApp.toUpperCase()}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB CONTENT 2: CASH ON DELIVERY (COD + OTP) */}
            {activeTab === 'cod' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    COD Verification Challenge (RTO Fraud Safeguard)
                  </span>
                  <p className="text-neutral-300 text-[11px]">
                    To confirm physical delivery and prevent bogus transit orders, an instant SMS OTP is verified before shipment.
                  </p>
                </div>

                {codStep === 'request' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                        Your Registered Indian Mobile Number
                      </label>
                      <div className="flex gap-2">
                        <span className="px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-neutral-400 flex items-center">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          defaultValue="9826198765"
                          className="flex-1 bg-neutral-950 border border-neutral-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setCodStep('verify')}
                      className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors"
                    >
                      Send 4-Digit Confirmation OTP
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleVerifyCodOtp} className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                        Enter 4-Digit OTP Sent via SMS & WhatsApp
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="e.g. 5824 (Use any 4 digits)"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-400 rounded-xl py-2.5 px-4 text-center font-mono text-lg tracking-widest text-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing || otpCode.length < 4}
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? 'Validating OTP...' : 'Verify OTP & Confirm Cash on Delivery Order'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB CONTENT 3: NO-COST EMI */}
            {activeTab === 'emi' && (
              <div className="space-y-4 animate-fade-in">
                <div className="text-xs font-semibold text-neutral-300">
                  Select No-Cost EMI Installment Plan (0% Interest)
                </div>

                <div className="space-y-2">
                  {[
                    { tenure: '3 Months', emi: Math.round(total / 3), bank: 'HDFC Bank, ICICI & Axis' },
                    { tenure: '6 Months', emi: Math.round(total / 6), bank: 'SBI Card & Kotak' },
                    { tenure: '9 Months', emi: Math.round(total / 9), bank: 'Bajaj Finserv EMI Card' },
                    { tenure: '12 Months', emi: Math.round(total / 12), bank: 'All Major Credit Cards' },
                  ].map((plan, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-cyan-500/50 cursor-pointer transition-all"
                      onClick={() => handlePayViaUpi('emi')}
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{plan.tenure} No-Cost EMI</div>
                        <div className="text-[10px] text-neutral-400">{plan.bank}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-emerald-400">
                          ₹{plan.emi.toLocaleString('en-IN')}/mo
                        </div>
                        <div className="text-[9px] text-neutral-500">Zero Processing Fee</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: DEBIT/CREDIT CARDS */}
            {activeTab === 'card' && (
              <div className="space-y-3 animate-fade-in text-xs">
                <div>
                  <label className="text-neutral-300 block mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="4111 2222 3333 4444"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-300 block mb-1">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-300 block mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={3}
                      placeholder="123"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handlePayViaUpi('card')}
                  disabled={isProcessing}
                  className="w-full mt-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-colors"
                >
                  Pay Securely via RuPay / Visa / Mastercard
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

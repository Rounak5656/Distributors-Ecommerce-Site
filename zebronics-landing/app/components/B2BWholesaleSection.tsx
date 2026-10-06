"use client";

import React, { useState } from 'react';
import { 
  Building2, 
  Percent, 
  MessageSquare, 
  CheckCircle2, 
  FileSpreadsheet, 
  ArrowRight, 
  Calculator,
  ShieldAlert
} from 'lucide-react';
import { PRODUCTS, Product } from '../data/products';

interface B2BWholesaleSectionProps {
  lang?: 'en' | 'hi';
  onAddToCart?: (product: Product, quantity: number) => void;
}

const STATE_CODES: Record<string, string> = {
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '19': 'West Bengal',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '27': 'Maharashtra',
  '29': 'Karnataka',
  '33': 'Tamil Nadu',
  '36': 'Telangana',
};

export default function B2BWholesaleSection({ lang = 'en', onAddToCart }: B2BWholesaleSectionProps) {
  const isHi = lang === 'hi';

  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [quantity, setQuantity] = useState<number>(10);
  const [gstin, setGstin] = useState<string>('23AABCK1234F1Z5');
  const [companyName, setCompanyName] = useState<string>('Mahakoshal Electronics & Co.');
  const [gstValid, setGstValid] = useState<boolean>(true);
  const [detectedState, setDetectedState] = useState<string>('Madhya Pradesh');

  // Pricing calculations
  const isMasterTier = quantity >= 20;
  const isDealerTier = quantity >= 5 && quantity < 20;

  const unitPrice = isMasterTier
    ? selectedProduct.b2bMasterPrice
    : isDealerTier
    ? selectedProduct.b2bDealerPrice
    : selectedProduct.price;

  const subtotal = unitPrice * quantity;
  const mrpTotal = selectedProduct.mrp * quantity;
  const totalSavings = mrpTotal - subtotal;
  const gstAmount = Math.round(subtotal * (selectedProduct.gstRate / 100));
  const finalTotal = subtotal + gstAmount;

  // Handle GSTIN change & state extraction
  const handleGstinChange = (val: string) => {
    const clean = val.toUpperCase().trim();
    setGstin(clean);

    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (regex.test(clean)) {
      setGstValid(true);
      const stateCode = clean.substring(0, 2);
      setDetectedState(STATE_CODES[stateCode] || 'State Identified');
    } else {
      setGstValid(false);
      setDetectedState('');
    }
  };

  // WhatsApp RFQ link generation
  const generateWhatsAppUrl = () => {
    const phone = '919425100000'; // Kailash Electronics Official Wholesale Desk
    const text = `*B2B WHOLESALE RFQ - KAILASH ELECTRONICS*%0A%0A` +
      `*Product:* ${selectedProduct.name}%0A` +
      `*SKU:* ${selectedProduct.sku}%0A` +
      `*Quantity:* ${quantity} Units%0A` +
      `*Tier:* ${isMasterTier ? 'Master Regional Distributor (35% OFF)' : isDealerTier ? 'Authorized Dealer (22% OFF)' : 'Sample Order'}%0A` +
      `*Estimated Subtotal:* ₹${subtotal.toLocaleString('en-IN')}%0A` +
      `*GST Rate (${selectedProduct.gstRate}%):* ₹${gstAmount.toLocaleString('en-IN')}%0A` +
      `*Final Amount:* ₹${finalTotal.toLocaleString('en-IN')}%0A%0A` +
      `*Business Details:*%0A` +
      `*Firm Name:* ${companyName || 'Registered Dealer'}%0A` +
      `*GSTIN:* ${gstin}%0A` +
      `*State:* ${detectedState || 'India'}%0A%0A` +
      `Please provide formal Proforma Tax Invoice and dispatch date from your Central India warehouse.`;

    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <div id="b2b-wholesale" className="w-full my-12 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border border-neutral-800 p-6 md:p-10 shadow-2xl">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            {isHi ? 'बी2बी थोक व वितरक पोर्टल' : 'B2B Wholesale & Dealership Desk'}
          </div>
          <h3 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            {isHi ? 'थोक मूल्य और जीएसटी इनवॉइस कैलकुलेटर' : 'Tiered Volume Pricing & GST Tax Invoicing'}
          </h3>
          <p className="text-neutral-400 text-xs md:text-sm mt-1">
            Direct factory distribution for retail shops, regional distributors, and institutions with Input Tax Credit (ITC).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={generateWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold text-xs md:text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25 whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            {isHi ? 'व्हाट्सएप पर कोटेशन लें' : '1-Click WhatsApp RFQ'}
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* LEFT COLUMN: PRODUCT & QUANTITY SELECTOR */}
        <div className="lg:col-span-7 space-y-6">
          {/* PRODUCT DROPDOWN */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Select Product for Wholesale Calculation
            </label>
            <select
              value={selectedProduct.id}
              onChange={(e) => {
                const prod = PRODUCTS.find((p) => p.id === e.target.value);
                if (prod) setSelectedProduct(prod);
              }}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
            >
              {PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.brand}] {p.name} — Retail: ₹{p.price.toLocaleString('en-IN')} | B2B Min: ₹{p.b2bMasterPrice.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          {/* QUANTITY SLIDER & SLAB SELECTOR */}
          <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-400" />
                Select Order Quantity (Units)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-20 bg-neutral-950 border border-neutral-700 text-cyan-400 font-mono font-bold text-center py-1.5 rounded-xl text-base focus:outline-none focus:border-cyan-400"
                />
                <span className="text-xs text-neutral-400">Units</span>
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full h-2.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 transition-all"
            />

            {/* THREE TIER BADGES */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div 
                onClick={() => setQuantity(2)}
                className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                  quantity < 5 
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 shadow-md' 
                    : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="text-[11px] font-semibold">Sample (1-4)</div>
                <div className="text-xs font-bold text-white mt-0.5">₹{selectedProduct.price.toLocaleString('en-IN')}/u</div>
                <div className="text-[10px] text-neutral-500">Retail Base</div>
              </div>

              <div 
                onClick={() => setQuantity(10)}
                className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                  isDealerTier 
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 shadow-md ring-1 ring-emerald-500/40' 
                    : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="text-[11px] font-semibold text-emerald-400">Dealer (5-19)</div>
                <div className="text-xs font-bold text-white mt-0.5">₹{selectedProduct.b2bDealerPrice.toLocaleString('en-IN')}/u</div>
                <div className="text-[10px] text-emerald-500 font-medium">Save ~22%</div>
              </div>

              <div 
                onClick={() => setQuantity(25)}
                className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                  isMasterTier 
                    ? 'border-amber-500 bg-amber-500/15 text-amber-300 shadow-md ring-1 ring-amber-500/40' 
                    : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="text-[11px] font-semibold text-amber-400">Master (20+)</div>
                <div className="text-xs font-bold text-white mt-0.5">₹{selectedProduct.b2bMasterPrice.toLocaleString('en-IN')}/u</div>
                <div className="text-[10px] text-amber-500 font-medium">Max ~35% Off</div>
              </div>
            </div>
          </div>

          {/* GSTIN & FIRM VERIFICATION */}
          <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-3">
            <div className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
              <span>GSTIN Verification (Input Tax Credit / ITC)</span>
              {gstValid && detectedState && (
                <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified: {detectedState}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Enter 15-Digit GSTIN"
                  value={gstin}
                  onChange={(e) => handleGstinChange(e.target.value)}
                  maxLength={15}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Firm / Shop Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
              Tax invoices include HSN Code <span className="font-mono text-white">{selectedProduct.hsnCode}</span> for claimable GST returns (GSTR-2B).
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: FINANCIAL PROFORMA BREAKDOWN */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Proforma Estimate</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                {isMasterTier ? 'Master Distributor Slab' : isDealerTier ? 'Wholesale Dealer Slab' : 'Standard Rate'}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Total MRP ({quantity} units @ ₹{selectedProduct.mrp.toLocaleString('en-IN')})</span>
                <span className="line-through">₹{mrpTotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-white font-medium">
                <span>Wholesale Subtotal (@ ₹{unitPrice.toLocaleString('en-IN')}/unit)</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-emerald-400 font-semibold bg-emerald-950/30 p-2 rounded-lg">
                <span>Dealer Margin / Savings</span>
                <span>- ₹{totalSavings.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-neutral-400 border-t border-neutral-800/80 pt-2">
                <span>GST ({selectedProduct.gstRate}% - CGST + SGST)</span>
                <span>₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-neutral-400">
                <span>Freight & Transit Insurance (Jabalpur Hub)</span>
                <span className="text-cyan-400 font-semibold">{quantity >= 10 ? 'FREE FREIGHT' : '₹650'}</span>
              </div>
            </div>

            <div className="border-t-2 border-dashed border-neutral-800 pt-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block">Total Payable (Inc. GST)</span>
                  <span className="text-2xl font-extrabold text-white tracking-tight">
                    ₹{(finalTotal + (quantity >= 10 ? 0 : 650)).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-400 block font-medium">Input Tax Credit (ITC)</span>
                  <span className="text-xs font-mono text-emerald-300">₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2.5">
            {onAddToCart && (
              <button
                onClick={() => onAddToCart(selectedProduct, quantity)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs md:text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                Add {quantity} Units to B2B Cart
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold text-xs md:text-sm transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Request Official Tax Proforma on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

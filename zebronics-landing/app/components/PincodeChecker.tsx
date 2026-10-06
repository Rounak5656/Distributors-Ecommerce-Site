"use client";

import React, { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle, Clock, Truck, ShieldCheck } from 'lucide-react';

interface PincodeCheckerProps {
  lang?: 'en' | 'hi';
}

export default function PincodeChecker({ lang = 'en' }: PincodeCheckerProps) {
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [deliveryInfo, setDeliveryInfo] = useState<{
    city: string;
    state: string;
    days: string;
    codAvailable: boolean;
    courier: string;
  } | null>(null);

  const isHi = lang === 'hi';

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincode.trim();

    if (!/^[1-9][0-9]{5}$/.test(clean)) {
      setStatus('error');
      setDeliveryInfo(null);
      return;
    }

    const prefix = clean.substring(0, 2);
    let city = 'Your Area';
    let state = 'India';
    let days = '2 - 3 Days';
    let courier = 'Blue Dart Express';

    if (prefix === '48' || prefix === '45' || prefix === '46' || prefix === '47') {
      city = prefix === '48' ? 'Jabalpur / Mahakoshal' : 'Indore / Bhopal';
      state = 'Madhya Pradesh';
      days = 'Next Day Dispatch (24 - 48 Hours)';
      courier = 'Local Warehouse Surface / Blue Dart';
    } else if (prefix === '49') {
      city = 'Raipur / Bilaspur';
      state = 'Chhattisgarh';
      days = '2 Days Express';
      courier = 'Delhivery Heavy Cargo';
    } else if (prefix === '11' || prefix === '12' || prefix === '20') {
      city = 'Delhi NCR';
      state = 'Delhi / UP / Haryana';
      days = '2 - 3 Business Days';
      courier = 'Blue Dart Air / Surface';
    } else if (prefix === '40' || prefix === '41') {
      city = 'Mumbai / Pune';
      state = 'Maharashtra';
      days = '2 - 3 Business Days';
      courier = 'Delhivery Logistics';
    } else if (prefix === '56' || prefix === '60') {
      city = 'Bengaluru / Chennai';
      state = 'Karnataka / Tamil Nadu';
      days = '3 - 4 Business Days';
      courier = 'Bluedart Apex';
    } else {
      city = 'Pan-India Destination';
      state = 'Direct Service Area';
      days = '3 - 5 Days';
      courier = 'Shiprocket / Delhivery B2B';
    }

    setDeliveryInfo({
      city,
      state,
      days,
      codAvailable: true,
      courier,
    });
    setStatus('success');
  };

  return (
    <div className="w-full rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4 md:p-5 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-white">
        <MapPin className="w-4 h-4 text-cyan-400" />
        <span>{isHi ? 'पिनकोड डिलीवरी व फ्रेट जांचें' : 'Check Pincode Serviceability & Delivery Time'}</span>
      </div>
      <p className="text-xs text-neutral-400 mb-3">
        {isHi 
          ? 'अपने शहर के लिए अनुमानित डिलीवरी समय और कैश ऑन डिलीवरी उपलब्धता देखें' 
          : 'Enter your 6-digit Indian PIN to check real-time courier transit and COD availability'}
      </p>

      <form onSubmit={checkPincode} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="e.g. 482001, 110001"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, ''));
            setStatus('idle');
          }}
          className="flex-1 bg-neutral-950 border border-neutral-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none transition-all font-mono"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs md:text-sm transition-all shadow-md shadow-cyan-500/20 whitespace-nowrap"
        >
          {isHi ? 'जांचें' : 'Check PIN'}
        </button>
      </form>

      {status === 'error' && (
        <div className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-800/60 p-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{isHi ? 'कृपया मान्य 6-अंकीय भारतीय पिनकोड दर्ज करें' : 'Please enter a valid 6-digit Indian Postal Code.'}</span>
        </div>
      )}

      {status === 'success' && deliveryInfo && (
        <div className="mt-3 bg-neutral-950/80 border border-emerald-500/30 rounded-xl p-3.5 space-y-2 animate-fade-in text-xs">
          <div className="flex items-center justify-between text-emerald-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {isHi ? 'सेवा उपलब्ध है' : 'Deliverable by Central India Hub'}
            </span>
            <span className="font-semibold text-white">{deliveryInfo.city}, {deliveryInfo.state}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-neutral-800 text-neutral-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{deliveryInfo.days}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>Partner: {deliveryInfo.courier}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-emerald-300/80 bg-emerald-950/30 px-2 py-1 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cash On Delivery (COD) & Verified GST Invoicing Available for this route.</span>
          </div>
        </div>
      )}
    </div>
  );
}

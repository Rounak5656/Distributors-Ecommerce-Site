"use client";

import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { Product } from '../data/products';

export interface CartItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  gstRate: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  lang?: 'en' | 'hi';
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  lang = 'en',
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMsg, setCouponMsg] = useState<string>('');

  const isHi = lang === 'hi';

  if (!isOpen) return null;

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Calculate weighted GST
  const gstAmount = Math.round(
    items.reduce((acc, item) => acc + item.price * item.quantity * (item.gstRate / 100), 0)
  );

  const discountAmount = Math.round((subtotal * appliedDiscount) / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount + gstAmount);

  const FREE_SHIPPING_THRESHOLD = 10000;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'DIWALI10' || code === 'B2BFIRST') {
      setAppliedDiscount(10);
      setCouponMsg('10% Festive Distributor Discount Applied!');
    } else {
      setCouponMsg('Invalid promo code. Try DIWALI10');
      setAppliedDiscount(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col h-full overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              {isHi ? 'आपकी कार्ट' : 'Shopping & B2B Cart'} ({totalItemsCount})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FREE PAN-INDIA FREIGHT METER */}
        <div className="px-5 py-3 bg-neutral-950/90 border-b border-neutral-800/80 text-xs">
          <div className="flex items-center justify-between mb-1.5 text-neutral-300">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-cyan-400" />
              {amountNeededForFreeShipping === 0 ? (
                <span className="text-emerald-400 font-bold">Free Pan-India Freight Unlocked!</span>
              ) : (
                <span>
                  Add <strong className="text-white">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> for Free Pallet Freight
                </span>
              )}
            </span>
            <span className="text-cyan-400 font-mono">{progressToFreeShipping}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* CART ITEMS SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-neutral-800/60 border border-neutral-700 flex items-center justify-center text-neutral-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-white">Your Cart is Empty</h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                  Browse our multi-brand catalog (Zebronics, GEM, Intex, Takara, Crockery) to add items.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-700 transition-all"
              >
                <div className="w-20 h-20 rounded-xl bg-neutral-900 border border-neutral-800 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono block mt-0.5">
                      {item.brand} | SKU: {item.sku}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-white">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>

                    <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-cyan-400 text-neutral-400 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white px-1.5 font-mono">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-cyan-400 text-neutral-400 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER & CHECKOUT */}
        {items.length > 0 && (
          <div className="p-5 border-t border-neutral-800 bg-neutral-950/90 space-y-4">
            {/* COUPON CODE FORM */}
            <form onSubmit={applyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Promo Code (DIWALI10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-700 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs text-white uppercase font-mono focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
              >
                Apply
              </button>
            </form>
            {couponMsg && (
              <span
                className={`text-[11px] block ${
                  appliedDiscount > 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {couponMsg}
              </span>
            )}

            {/* BREAKDOWN */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Distributor Discount (10%)</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-400">
                <span>GST (Tax Credit Eligible)</span>
                <span>₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-neutral-800">
                <span>Final Payable</span>
                <span className="text-cyan-400">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-bold text-xs md:text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
            >
              Checkout & Pay with UPI / COD
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

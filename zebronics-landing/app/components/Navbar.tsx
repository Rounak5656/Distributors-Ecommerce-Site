"use client";

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Rotate3d, 
  Building2, 
  Globe, 
  MessageSquare, 
  Menu, 
  X,
  Phone,
  Layers,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  isB2BMode: boolean;
  onToggleB2BMode: () => void;
  lang: 'en' | 'hi';
  onToggleLang: () => void;
  onOpen3DStudio?: () => void;
}

export default function Navbar({
  cartCount,
  onOpenCart,
  isB2BMode,
  onToggleB2BMode,
  lang,
  onToggleLang,
  onOpen3DStudio,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const isHi = lang === 'hi';

  return (
    <header className="sticky top-0 z-40 w-full bg-black/80 backdrop-blur-xl border-b border-neutral-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* BRAND LOGO */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
              <span className="text-cyan-400 font-extrabold text-base font-mono">KE</span>
            </div>
          </div>
          <div>
            <span className="text-base md:text-lg font-black tracking-tight text-white block group-hover:text-cyan-400 transition-colors">
              KAILASH ELECTRONICS
            </span>
            <span className="text-[10px] text-neutral-400 block -mt-0.5 tracking-wider uppercase font-medium">
              {isHi ? 'अधिकृत इलेक्ट्रॉनिक्स वितरक' : 'Authorized Central India Distributor'}
            </span>
          </div>
        </a>

        {/* DESKTOP NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-300">
          <a href="#studio-3d" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
            <Rotate3d className="w-3.5 h-3.5 text-cyan-400" />
            {isHi ? '3डी स्टूडियो' : '3D Studio'}
          </a>
          <a href="#catalog" className="hover:text-cyan-400 transition-colors">
            {isHi ? 'उत्पाद सूची' : 'Product Catalog'}
          </a>
          <a href="#b2b-wholesale" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            {isHi ? 'थोक व जीएसटी' : 'B2B Wholesale & GST'}
          </a>
          <a href="#pincode-tracker" className="hover:text-cyan-400 transition-colors">
            {isHi ? 'डिलीवरी जांचें' : 'Pincode Check'}
          </a>
        </nav>

        {/* RIGHT ACTIONS: B2B TOGGLE, LANG, CART */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* B2B PRICING TOGGLE */}
          <button
            onClick={onToggleB2BMode}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isB2BMode
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title="Toggle between retail pricing and dealer wholesale rates"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{isB2BMode ? (isHi ? 'बी2बी थोक चालू' : 'B2B Wholesale Active') : (isHi ? 'खुदरा दरें' : 'Retail Price Mode')}</span>
          </button>

          {/* LANGUAGE SWITCHER */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
            title="Switch Language (English / हिन्दी)"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'en' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* WHATSAPP B2B DESK */}
          <a
            href="https://wa.me/919425100000?text=Hello%20Kailash%20Electronics%20Wholesale%20Team,%20I%20want%20to%20inquire%20about%20dealership%20and%20bulk%20orders."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:text-emerald-400 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp RFQ</span>
          </a>

          {/* CART DRAWER BUTTON */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{isHi ? 'कार्ट' : 'Cart'}</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-black text-[11px] font-black flex items-center justify-center animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950 p-4 space-y-3 animate-fade-in text-sm">
          <a
            href="#studio-3d"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-neutral-300 py-1.5"
          >
            <Rotate3d className="w-4 h-4 text-cyan-400" />
            3D WebGL Studio
          </a>
          <a
            href="#catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-neutral-300 py-1.5"
          >
            Product Catalog (Zebronics, GEM, Intex, Takara, Crockery)
          </a>
          <a
            href="#b2b-wholesale"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-neutral-300 py-1.5"
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            B2B Wholesale Slabs & GST Invoicing
          </a>
          <a
            href="#pincode-tracker"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-neutral-300 py-1.5"
          >
            Check Delivery Pincode
          </a>
          <div className="pt-2 border-t border-neutral-800 flex justify-between items-center">
            <button
              onClick={() => {
                onToggleB2BMode();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-emerald-400 font-semibold"
            >
              Toggle B2B Wholesale Mode ({isB2BMode ? 'ON' : 'OFF'})
            </button>
            <a
              href="https://wa.me/919425100000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-400 font-semibold flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp Desk
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

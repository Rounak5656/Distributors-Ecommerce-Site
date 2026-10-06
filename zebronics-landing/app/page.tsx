"use client";

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import SpeakerScroll from './components/SpeakerScroll';
import ThreeDProductStudio from './components/ThreeDProductStudio';
import ProductCatalog from './components/ProductCatalog';
import CartDrawer, { CartItem } from './components/CartDrawer';
import IndiaPaymentModal from './components/IndiaPaymentModal';
import ProductDetailModal from './components/ProductDetailModal';
import B2BWholesaleSection from './components/B2BWholesaleSection';
import PincodeChecker from './components/PincodeChecker';
import TrustBadges from './components/TrustBadges';
import { PRODUCTS, Product } from './data/products';
import { 
  ArrowRight, 
  Rotate3d, 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare,
  Award,
  Sparkles,
  Truck
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'zeb-thump-800',
      sku: 'ZEB-THP-800-IND',
      name: 'Zebronics Thump 800 Party Trolley Speaker',
      brand: 'Zebronics',
      price: 7999,
      quantity: 2,
      image: '/images/zeb-party-woofer.png',
      gstRate: 18,
    }
  ]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isB2BMode, setIsB2BMode] = useState<boolean>(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const isHi = lang === 'hi';

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const unitPrice = isB2BMode ? product.b2bDealerPrice : product.price;

      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            sku: product.sku,
            name: product.name,
            brand: product.brand,
            price: unitPrice,
            quantity,
            image: product.image,
            gstRate: product.gstRate,
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOpenProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleScrollTo3D = () => {
    const el = document.getElementById('studio-3d');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Cart total calculations
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartGst = Math.round(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity * (item.gstRate / 100), 0)
  );
  const cartTotal = cartSubtotal + cartGst;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-cyan-500/30 selection:text-cyan-300">
      {/* GLOBAL NAVBAR */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        isB2BMode={isB2BMode}
        onToggleB2BMode={() => setIsB2BMode(!isB2BMode)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'hi' : 'en')}
        onOpen3DStudio={handleScrollTo3D}
      />

      {/* HERO BANNER SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Background glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-purple-600/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-300 text-xs font-semibold backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{isHi ? 'केंद्रीय भारत अधिकृत वितरक नेटवर्क' : 'Official Central India Distributor Network'}</span>
            <span className="text-neutral-500">|</span>
            <span className="text-cyan-400 font-mono">GST Verified</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
            {isHi ? (
              <>
                इलेक्ट्रॉनिक्स का भविष्य. <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  थोक दरें व 3डी अनुभव।
                </span>
              </>
            ) : (
              <>
                Precision Audio. <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  Distributor Pricing in Real-Time 3D.
                </span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {isHi
              ? 'कैलाश इलेक्ट्रॉनिक्स - जेब्रोनिक्स, जेम, इंटेक्स, ताकारा और क्रॉकरी के शीर्ष वितरक। वास्तविक 3डी में आंतरिक पुर्जे देखें, थोक दरों की गणना करें और यूपीआई या कैश ऑन डिलीवरी से ऑर्डर करें।'
              : 'Authorized distributor for Zebronics, GEM, Intex, Takara & Crockery. Inspect hardware in real-time WebGL 3D, calculate tiered B2B wholesale pricing with GST Input Tax Credit, and checkout with 1-Click UPI.'}
          </p>

          {/* CTA ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={handleScrollTo3D}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2"
            >
              <Rotate3d className="w-4 h-4" />
              {isHi ? '3डी स्टूडियो में देखें' : 'Launch 3D WebGL Studio'}
            </button>

            <a
              href="#b2b-wholesale"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              {isHi ? 'बी2बी थोक मूल्य स्लैब' : 'B2B Wholesale & GST Slabs'}
            </a>

            <a
              href="#catalog"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 text-neutral-300 text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <span>{isHi ? 'कैटलॉग देखें' : 'Browse Catalog'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* STATS STRIP */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-neutral-900 text-center">
            <div className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-900">
              <span className="text-xl md:text-2xl font-black text-white font-mono block">₹14Cr+</span>
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Wholesale Dispatched</span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-900">
              <span className="text-xl md:text-2xl font-black text-cyan-400 font-mono block">2,400+</span>
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Verified Retailers</span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-900">
              <span className="text-xl md:text-2xl font-black text-emerald-400 font-mono block">24-48 Hrs</span>
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Central Hub Dispatch</span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-900">
              <span className="text-xl md:text-2xl font-black text-amber-400 font-mono block">100% ITC</span>
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider">GST Tax Invoicing</span>
            </div>
          </div>
        </div>
      </section>

      {/* APPLE-STYLE SCROLL SCRUBBER SECTION */}
      <section className="relative w-full border-y border-neutral-900">
        <SpeakerScroll />
      </section>

      {/* MAIN CONTENT WRAPPER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-16 py-12">
        {/* 1. 3D WEBGL INTERACTIVE PRODUCT STUDIO */}
        <section id="studio-3d" className="scroll-mt-24">
          <ThreeDProductStudio />
        </section>

        {/* 2. TRUST AND CERTIFICATIONS BADGES */}
        <TrustBadges lang={lang} />

        {/* 3. PINCODE LOGISTICS & DELIVERY CHECKER */}
        <section id="pincode-tracker" className="scroll-mt-24 max-w-2xl mx-auto w-full">
          <PincodeChecker lang={lang} />
        </section>

        {/* 4. COMPREHENSIVE MULTI-BRAND PRODUCT CATALOG */}
        <ProductCatalog
          onSelectProduct={handleOpenProductDetail}
          onAddToCart={handleAddToCart}
          onOpen3DStudio={handleScrollTo3D}
          isB2BMode={isB2BMode}
          lang={lang}
        />

        {/* 5. B2B WHOLESALE & GST SLAB CALCULATOR */}
        <B2BWholesaleSection lang={lang} onAddToCart={handleAddToCart} />
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-neutral-950 border-t border-neutral-800 mt-20 pt-14 pb-8 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-800/80">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold font-mono">
                KE
              </div>
              <span className="text-sm font-bold text-white tracking-tight">Kailash Electronics</span>
            </div>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Leading electronics, appliances, and crockery distributor based in Central India. Authorized partner for Zebronics, GEM, Intex, Takara, and international crockery lines.
            </p>
            <div className="flex items-center gap-2 text-cyan-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>GST Registered B2B Entity (23AABCK1234F1Z5)</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Showroom & Warehouse</h4>
            <div className="flex items-start gap-2 text-[11px]">
              <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>Main Electronics Market, Near Civic Center, Jabalpur, Madhya Pradesh - 482002</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>+91 94251 00000 / 0761-2400000</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>wholesale@kailashelectronics.com</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Authorized Brand Divisions</h4>
            <ul className="space-y-1 text-[11px]">
              <li>Zebronics Soundbars & Trolley Audio</li>
              <li>GEM Refrigerators & Semi-Automatic Washers</li>
              <li>Intex Smart LED TVs & Inverter ACs</li>
              <li>Takara Frost-Free Refrigerators & QLEDs</li>
              <li>Kailash Premium Crockery & Glassware</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">B2B Dealership Desk</h4>
            <p className="text-[11px] text-neutral-400">
              Are you an electronics retailer or dealer in MP, CG, UP, or Maharashtra? Get factory wholesale slabs and credit terms.
            </p>
            <a
              href="https://wa.me/919425100000?text=Hello,%20I%20want%20to%20apply%20for%20a%20dealership%20account%20with%20Kailash%20Electronics."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold hover:bg-emerald-600/30 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chat with Sales Manager
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 Kailash Electronics. All rights reserved. Built with Next.js 16, React 19 & WebGL Three.js.</p>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Privacy Policy</span>
            <span>Terms of Wholesale</span>
            <span>GST Compliance</span>
            <span>Shipping Policy</span>
          </div>
        </div>
      </footer>

      {/* MODALS & DRAWERS */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => setIsPaymentModalOpen(true)}
        lang={lang}
      />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onAddToCart={handleAddToCart}
        onOpen3DStudio={handleScrollTo3D}
        lang={lang}
      />

      <IndiaPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        items={cartItems}
        subtotal={cartSubtotal}
        gstAmount={cartGst}
        total={cartTotal}
        onPaymentSuccess={() => {
          setCartItems([]);
        }}
      />
    </div>
  );
}

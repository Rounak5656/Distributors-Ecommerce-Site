"use client";

import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Truck, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Rotate3d, 
  CheckCircle2, 
  MessageSquare,
  FileSpreadsheet
} from 'lucide-react';
import { Product } from '../data/products';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpen3DStudio?: () => void;
  lang?: 'en' | 'hi';
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onOpen3DStudio,
  lang = 'en',
}: ProductDetailModalProps) {
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  if (!isOpen || !product) return null;

  const currentImg = activeImage || product.image;
  const isHi = lang === 'hi';

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              {product.brand} Official
            </span>
            <span className="text-neutral-500 text-xs font-mono">SKU: {product.sku}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* LEFT: IMAGE GALLERY & 3D LAUNCHER */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl bg-neutral-950 border border-neutral-800 p-6 flex items-center justify-center overflow-hidden">
              <img
                src={currentImg}
                alt={product.name}
                className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-cyan-500 text-black text-xs font-extrabold shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* THUMBNAILS */}
            {product.galleryImages && product.galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl border p-1 bg-neutral-950 shrink-0 transition-all ${
                      currentImg === img ? 'border-cyan-400 ring-2 ring-cyan-500/30' : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {product.has3DViewer && onOpen3DStudio && (
              <button
                onClick={() => {
                  onClose();
                  onOpen3DStudio();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-neutral-800 to-neutral-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/10"
              >
                <Rotate3d className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                Launch 360° Exploded 3D WebGL Studio
              </button>
            )}
          </div>

          {/* RIGHT: SPECS, PRICING & ACTIONS */}
          <div className="md:col-span-6 space-y-5">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">{product.name}</h2>
              <p className="text-xs text-neutral-400 mt-1">{product.tagline}</p>
              
              <div className="flex items-center gap-3 mt-2.5">
                <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg text-amber-400 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs text-neutral-400">({product.reviewCount} Dealer Reviews)</span>
                <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {product.inStock} Units in Central Warehouse
                </span>
              </div>
            </div>

            {/* PRICING MATRIX */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl md:text-3xl font-extrabold text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-neutral-400 line-through">
                  MRP: ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                <span className="text-neutral-400">B2B Wholesale (5+ Units):</span>
                <span className="font-mono font-bold text-cyan-400">
                  ₹{product.b2bDealerPrice.toLocaleString('en-IN')} / unit
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Master Distributor (20+ Units):</span>
                <span className="font-mono font-bold text-amber-400">
                  ₹{product.b2bMasterPrice.toLocaleString('en-IN')} / unit
                </span>
              </div>

              <div className="pt-1 text-[11px] text-neutral-500 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3 h-3 text-cyan-400" />
                GST Rate: {product.gstRate}% | HSN: {product.hsnCode} (Input Tax Credit Eligible)
              </div>
            </div>

            {/* KEY HIGHLIGHTS */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">Key Highlights</span>
              <ul className="space-y-1 text-xs text-neutral-400">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* TECHNICAL SPECIFICATIONS TABLE */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">Specifications</span>
              <div className="rounded-xl border border-neutral-800 overflow-hidden text-xs">
                {Object.entries(product.specs).map(([key, val], index) => (
                  <div
                    key={key}
                    className={`flex justify-between p-2.5 ${
                      index % 2 === 0 ? 'bg-neutral-950' : 'bg-neutral-900/60'
                    }`}
                  >
                    <span className="text-neutral-400">{key}</span>
                    <span className="text-white font-medium text-right max-w-[60%]">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ADD TO CART & QUANTITY */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-700 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-white px-2 font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-bold text-xs md:text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart (₹{(product.price * quantity).toLocaleString('en-IN')})
                </button>
              </div>

              <a
                href={`https://wa.me/919425100000?text=Hello%20Kailash%20Electronics,%20I%20am%20interested%20in%20ordering%20${quantity}%20units%20of%20${product.name}%20(SKU:%20${product.sku}).%20Please%20provide%20wholesale%20dealer%20quote.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                Inquire via WhatsApp Desk
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

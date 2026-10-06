"use client";

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Rotate3d, 
  ShoppingBag, 
  Star, 
  Eye, 
  CheckCircle2, 
  Sparkles,
  ArrowUpDown,
  Building2,
  Tag
} from 'lucide-react';
import { PRODUCTS, Product } from '../data/products';

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpen3DStudio: () => void;
  isB2BMode: boolean;
  lang?: 'en' | 'hi';
}

export default function ProductCatalog({
  onSelectProduct,
  onAddToCart,
  onOpen3DStudio,
  isB2BMode,
  lang = 'en',
}: ProductCatalogProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const isHi = lang === 'hi';

  const brands = ['All', 'Zebronics', 'GEM', 'Intex', 'Takara', 'Crockery'];
  const categories = ['All', 'Audio', 'Television', 'Appliances', 'Cooling', 'IT Peripherals', 'Crockery'];

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchBrand = selectedBrand === 'All' || p.brand === selectedBrand;
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);

      return matchBrand && matchCategory && matchSearch;
    }).sort((a, b) => {
      const priceA = isB2BMode ? a.b2bDealerPrice : a.price;
      const priceB = isB2BMode ? b.b2bDealerPrice : b.price;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [selectedBrand, selectedCategory, searchQuery, sortBy, isB2BMode]);

  const handleAddToCartClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1200);
  };

  return (
    <section id="catalog" className="w-full my-12 space-y-8">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            {isHi ? 'प्रमाणित वितरक सूची' : 'Authorized Central India Catalog'}
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            {isHi ? 'मल्टी-ब्रांड इलेक्ट्रॉनिक्स व क्रॉकरी' : 'Electronics, Appliances & Crockery'}
          </h2>
          <p className="text-neutral-400 text-xs md:text-sm mt-1">
            Genuine wholesale inventory across Zebronics, GEM, Intex, Takara, and Crockery with instant GSTIN billing.
          </p>
        </div>

        {/* SEARCH INPUT */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isHi ? 'उत्पाद या ब्रांड खोजें...' : 'Search speakers, TV, fridge, crockery...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-cyan-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-white placeholder-neutral-500 focus:outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* BRAND TABS & SORT CONTROLS */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* BRAND BUTTONS */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap border ${
                selectedBrand === b
                  ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
              }`}
            >
              {b === 'All' ? (isHi ? 'सभी ब्रांड्स' : 'All Brands') : b}
            </button>
          ))}
        </div>

        {/* SORT DROPDOWN */}
        <div className="flex items-center gap-3 self-end lg:self-auto">
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-2xl px-3 py-1.5 text-xs text-neutral-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
            >
              <option value="featured" className="bg-neutral-900">Featured</option>
              <option value="price-low" className="bg-neutral-900">Price: Low to High</option>
              <option value="price-high" className="bg-neutral-900">Price: High to Low</option>
              <option value="rating" className="bg-neutral-900">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-neutral-900/60 text-neutral-400 border border-neutral-800 hover:text-neutral-200'
            }`}
          >
            {cat === 'All' ? (isHi ? 'सभी श्रेणियां' : 'All Categories') : cat}
          </button>
        ))}
      </div>

      {/* PRODUCT GRID */}
      {filteredProducts.length === 0 ? (
        <div className="p-16 rounded-3xl bg-neutral-900/40 border border-neutral-800 text-center space-y-3">
          <p className="text-base text-neutral-400">No products matched your search or filters.</p>
          <button
            onClick={() => {
              setSelectedBrand('All');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const activePrice = isB2BMode ? product.b2bDealerPrice : product.price;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group relative rounded-3xl bg-neutral-900/80 border border-neutral-800/80 hover:border-neutral-700 hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer backdrop-blur-sm"
              >
                {/* IMAGE CONTAINER */}
                <div className="relative aspect-[4/3] w-full bg-neutral-950 p-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* BADGES */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    <span className="px-2.5 py-0.5 rounded-lg bg-neutral-900/90 border border-neutral-700 text-neutral-300 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                      {product.brand}
                    </span>
                    {product.badge && (
                      <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] font-extrabold shadow-sm">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* 3D LAUNCH BUTTON (IF APPLICABLE) */}
                  {product.has3DViewer && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen3DStudio();
                      }}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-neutral-900/90 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all shadow-md backdrop-blur-md"
                      title="Launch 3D WebGL Studio"
                    >
                      <Rotate3d className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* PRODUCT INFO */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                      <span>SKU: {product.sku}</span>
                      <div className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-sm md:text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1">
                      {product.tagline}
                    </p>
                  </div>

                  {/* PRICING & ACTIONS */}
                  <div className="pt-2 border-t border-neutral-800/80 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-lg md:text-xl font-extrabold text-white">
                          ₹{activePrice.toLocaleString('en-IN')}
                        </span>
                        {isB2BMode ? (
                          <span className="text-[10px] text-emerald-400 block font-semibold">
                            Wholesale Dealer Rate
                          </span>
                        ) : (
                          <span className="text-[11px] text-neutral-500 line-through block">
                            MRP: ₹{product.mrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 block font-medium">
                          {product.inStock} In Stock
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          GST {product.gstRate}%
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleAddToCartClick(e, product)}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md ${
                          justAddedId === product.id
                            ? 'bg-emerald-500 text-black'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20'
                        }`}
                      >
                        {justAddedId === product.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Added!
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Add to Cart
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product);
                        }}
                        className="px-3 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors"
                        title="Quick View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

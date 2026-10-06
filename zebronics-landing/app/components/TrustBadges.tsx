"use client";

import React from 'react';
import { ShieldCheck, Truck, ReceiptText, Award, Headphones, MapPin } from 'lucide-react';

interface TrustBadgesProps {
  lang?: 'en' | 'hi';
}

export default function TrustBadges({ lang = 'en' }: TrustBadgesProps) {
  const isHi = lang === 'hi';

  const badges = [
    {
      icon: <Award className="w-6 h-6 text-amber-400" />,
      title: isHi ? 'अधिकृत ब्रांड डिस्ट्रीब्यूटर' : 'Authorized Brand Distributor',
      desc: isHi ? 'कैलाश इलेक्ट्रॉनिक्स - जेब्रोनिक्स, जेम, इंटेक्स, ताकारा' : 'Kailash Electronics - Zebronics, GEM, Intex, Takara Direct',
    },
    {
      icon: <ReceiptText className="w-6 h-6 text-emerald-400" />,
      title: isHi ? '100% जीएसटी इनपुट टैक्स क्रेडिट' : '100% GST Tax Invoices',
      desc: isHi ? 'सभी बी2बी ऑर्डर्स पर वैध एचएसएन कोड और आईटीसी बिल' : 'Valid HSN codes & ITC eligible invoices for all B2B buyers',
    },
    {
      icon: <Truck className="w-6 h-6 text-cyan-400" />,
      title: isHi ? 'अखिल भारतीय 24-48 घंटे डिस्पैच' : 'Pan-India Express Freight',
      desc: isHi ? 'ब्लूडार्ट और देल्हीवेरी द्वारा सुरक्षित पैलेट शिपिंग' : 'Safe pallet dispatch via Blue Dart & Delhivery surface cargo',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      title: isHi ? 'सीधे ब्रांड की ऑन-साइट वारंटी' : 'Genuine Brand Warranty',
      desc: isHi ? '1-10 साल की आधिकारिक कंपनी वारंटी सहायता' : '1 to 10 Years official manufacturer on-site service support',
    },
  ];

  return (
    <div className="w-full my-10 py-8 px-4 md:px-8 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4 text-red-400" />
            {isHi ? 'केंद्रीय भारत का सबसे बड़ा हब' : 'Central India Electronic Distribution Hub'}
          </div>
          <h4 className="text-lg md:text-xl font-bold text-white">
            {isHi ? 'कैलाश इलेक्ट्रॉनिक्स ट्रस्ट गारंटी' : 'Kailash Electronics Trust & Assurance'}
          </h4>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800/80 border border-neutral-700 text-neutral-300 text-xs">
          <Headphones className="w-4 h-4 text-emerald-400" />
          <span>{isHi ? 'डीलर सहायता हेल्पलाइन: +91 94251 00000' : 'Dealer B2B Desk: +91 94251 00000'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((b, idx) => (
          <div 
            key={idx} 
            className="flex items-start gap-3.5 p-3 rounded-2xl bg-neutral-950/40 border border-neutral-800/60 hover:border-neutral-700 transition-all hover:translate-y-[-2px]"
          >
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0">
              {b.icon}
            </div>
            <div>
              <h5 className="text-sm font-semibold text-white">{b.title}</h5>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

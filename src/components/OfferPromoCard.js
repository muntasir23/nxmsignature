import React from 'react';
import { Link } from "react-router-dom";

export default function OfferPromoCard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans antialiased">
      <div className="relative w-full bg-[#ebe4d6] rounded-3xl overflow-hidden shadow-sm border border-black/5 flex flex-col md:flex-row items-center justify-between min-h-[380px] group">
        
        {/* Left Side: Offer Copywriting Texts */}
        <div className="p-8 md:p-16 flex flex-col justify-center items-start z-10 max-w-xl">
          <span className="text-[10px] font-black tracking-[0.25em] uppercase text-[#5d655f] mb-3 bg-white/60 px-3 py-1 rounded-full backdrop-blur-sm">
            Limited Season Offer
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase mb-4">
            Elevate Your <br />
            Daily Wardrobe
          </h2>
          <p className="text-sm font-medium text-slate-700 mb-6 leading-relaxed">
            Get premium tailoring and exceptional fits across our signature Shirts, tailored Pants, and Heavy Piqué Polos. Refresh your signature style today.
          </p>
          
          {/* Action Button */}
          <Link 
            to="/rewards"
            className="inline-flex items-center space-x-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider px-6 py-4 rounded-xl shadow-md hover:bg-black transition-all duration-300"
          >
            <span>Claim Offer Now</span>
            <svg className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Right Side: Showcase Creative Product Image Card */}
        <div className="relative w-full md:w-[50%] h-[320px] md:h-[420px] p-6 flex justify-center items-center">
          {/* Subtle background element geometry */}
          <div className="absolute w-[80%] aspect-square bg-[#5d655f]/10 rounded-full blur-3xl" />
          
          {/* Foreground Frame Image Card */}
          <div className="relative w-[85%] h-full rounded-2xl overflow-hidden border-4 border-white shadow-xl rotate-2 group-hover:rotate-0 transition-transform duration-500 ease-out">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200" 
              alt="Nexmode Premium Campaign Showcase"
              className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            {/* Soft overlay protection */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>

      </div>
    </div>
  );
}
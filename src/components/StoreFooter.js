import React from 'react';

export default function StoreFooter() {
  return (
    <footer className="bg-[#000] text-[#ebe4d6] font-sans antialiased border-t border-white/10 mt-20">
      {/* Main Footer Links Container */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        
        {/* Column 1: Brand Info & About */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black tracking-widest text-white uppercase">
            NEXMODE
          </h2>
          <p className="text-xs text-[#ebe4d6]/80 leading-relaxed max-w-sm">
            Premium streetwear & minimalist style tailored to perfection. Experience the best in everyday apparel configurations.
          </p>
          {/* Social Links */}
          <div className="flex space-x-4 pt-2">
            <a 
              href="https://facebook.com/Nexmode" // Apnar absolute page link ekhane map korben
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-white text-white hover:text-[#5d655f] rounded-xl transition-all duration-300"
              aria-label="Facebook Page"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Quick Shop Links */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-white mb-4 border-b border-white/10 pb-2">
            Shop Collections
          </h3>
          <ul className="space-y-2.5 text-xs font-semibold text-[#ebe4d6]/80">
            <li><a href="/shirts" className="hover:text-white hover:underline transition-all">Premium Shirts</a></li>
            <li><a href="/polo" className="hover:text-white hover:underline transition-all">Classic Polos</a></li>
            <li><a href="/pants" className="hover:text-white hover:underline transition-all">Modern Pants</a></li>
            <li><a href="/new-arrivals" className="hover:text-white hover:underline transition-all">New Drops</a></li>
          </ul>
        </div>

        {/* Column 3: Customer Support */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-white mb-4 border-b border-white/10 pb-2">
            Customer Care
          </h3>
          <ul className="space-y-2.5 text-xs font-semibold text-[#ebe4d6]/80">
            <li><a href="/order-tracking" className="hover:text-white hover:underline transition-all">Track Your Order</a></li>
            <li><a href="/shipping-policy" className="hover:text-white hover:underline transition-all">Shipping & Delivery</a></li>
            <li><a href="/returns" className="hover:text-white hover:underline transition-all">Return & Exchange</a></li>
            <li><a href="/terms" className="hover:text-white hover:underline transition-all">Terms of Service</a></li>
          </ul>
        </div>

        {/* Column 4: Shop Contact Address Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2 border-b border-white/10 pb-2">
            Store Address
          </h3>
          
          <div className="flex items-start space-x-3 text-xs">
            <svg className="w-5 h-5 flex-shrink-0 text-white mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0 antiques" />
            </svg>
            <span className="leading-relaxed text-[#ebe4d6]/90">
              Shop No 40, 2nd Floor, Kollol Super Market, Prabarttak Circle, Chittagong.
            </span>
          </div>

          <div className="flex items-start space-x-3 text-xs pt-1">
            <svg className="w-5 h-5 flex-shrink-0 text-white mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div className="flex flex-col space-y-1 text-[#ebe4d6]/90 font-bold tracking-wide">
              <a href="tel:01973372807" className="hover:text-white transition-colors">01973372807</a>
              <a href="tel:01882372807" className="hover:text-white transition-colors">01882372807</a>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Legal Copyright Bar */}
      <div className="border-t border-white/5 bg-black/10 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-[#ebe4d6]/50">
          <span>&copy; {new Date().getFullYear()} NEXMODE. ALL RIGHTS RESERVED.</span>
          <span className="text-[10px]">CRAFTED FOR LONGEVITY & STREET CULTURE</span>
        </div>
      </div>
    </footer>
  );
}
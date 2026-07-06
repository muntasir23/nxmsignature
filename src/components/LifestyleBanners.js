import React from 'react';

export function LifestyleBanners() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 font-sans antialiased">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* ─── LEFT BANNER: STREETWEAR / COMFORT VIBE ─── */}
        <div className="flex-1 relative aspect-[16/10] md:aspect-[16/9] rounded-3xl overflow-hidden bg-slate-900 group">
          {/* Background Image Placeholder - Change src path to your actual assets */}
          <img 
            src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop" 
            alt="Nexmode Lifestyle Concept" 
            className="w-full h-full object-cover object-center opacity-75 group-hover:scale-101 transition-transform duration-700 ease-out"
          />
          {/* Subtle Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
            <span className="text-[9px] font-black tracking-[0.3em] text-gray-300 uppercase mb-1.5 block">
              Urban Movement
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide leading-tight max-w-sm">
              Define Your Signature Street Aesthetic
            </h3>
          </div>
        </div>

        {/* ─── RIGHT BANNER: MINIMALIST / CRAFTSMANSHIP VIBE ─── */}
        <div className="flex-1 relative aspect-[16/10] md:aspect-[16/9] rounded-3xl overflow-hidden bg-[#5d655f] group">
          {/* Background Image Placeholder - Change src path to your actual assets */}
          <img 
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop" 
            alt="Premium Fabric Lifestyle" 
            className="w-full h-full object-cover object-center opacity-70 group-hover:scale-101 transition-transform duration-700 ease-out"
          />
          {/* Subtle Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
            <span className="text-[9px] font-black tracking-[0.3em] text-gray-300 uppercase mb-1.5 block">
              Premium Craft
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide leading-tight max-w-sm">
              Tailored For Everyday Seamless Comfort
            </h3>
          </div>
        </div>

      </div>
    </div>
  );
}
import React from "react";

const bannerData = [
  {
    id: 1,
    title: "Premium Shirts",
    subtitle: "Full Sleeve, Casual & Q Ban Series",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
    link: "/shirts", // Apnar systemer route onushare change kore niben
    cta: "Shop Shirts",
  },
  {
    id: 2,
    title: "Classic Polo",
    subtitle: "Heavy Piqué & Minimalist Fits",
    image:
      "https://res.cloudinary.com/dmuj1bslb/image/upload/v1780431961/rxsccad6ziwksnsgfdfb.jpg",
    link: "/polo",
    cta: "Shop Polo",
  },
  {
    id: 3,
    title: "Modern Pants",
    subtitle: "Formal Trousers & Cotton Pants",
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800",
    link: "/pants",
    cta: "Shop Pants",
  },
];

export default function PromoBanners() {
  return (
    <>
      <div className="text-center mb-10 mt-20">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 block mb-2">
          Nexmode Premium Apparel
        </span>
        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-wide md:text-4xl">
          Shop By Category
        </h2>
        <div className="w-12 h-[3px] bg-black mx-auto mt-4 rounded-full" />
      </div>

      {/* Grid Wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Banner loop thakbe... */}
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10 font-sans antialiased">
        {/* Grid Wrapper: Mobile e 1 ta, Large screen e 3 ta pasha pashi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bannerData.map((banner) => (
            <a
              key={banner.id}
              href={banner.link}
              className="group relative block w-full aspect-[4/5] bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ease-out"
            >
              {/* Background Image */}
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Premium Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

              {/* Banner Content Card */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white z-10">
                <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-gray-300 mb-1">
                  {banner.subtitle}
                </span>
                <h3 className="text-xl md:text-2xl font-black tracking-wide uppercase mb-4">
                  {banner.title}
                </h3>

                {/* Animated Button Link Indicator */}
                <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider bg-white text-black px-4 py-2.5 rounded-lg w-fit transition-all duration-300 group-hover:bg-black group-hover:text-white group-hover:shadow-lg">
                  <span>{banner.cta}</span>
                  <svg
                    className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

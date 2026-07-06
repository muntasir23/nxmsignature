import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    title: "Next is Now Collection",
    subtitle: "Premium Streetwear & Oversized Fits",
    bgImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1920",
    ctaText: "Shop Now",
    link: "/shop"
  },
  {
    id: 2,
    title: "Minimalist Piqué Polo",
    subtitle: "Crafted for comfort and clean line art details",
    bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920",
    ctaText: "Explore Collection",
    link: "/polo"
  },
  {
    id: 3,
    title: "Elevate Your Style",
    subtitle: "Premium fabrics and modern tailoring combined",
    bgImage: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=1920",
    ctaText: "View All",
    link: "/shirts"
  }
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef();

  // Touch Swipe States
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum distance required for a swipe action (in pixels)
  const minSwipeDistance = 50;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  // ─── ১. AUTO SLIDE LOGIC ───
  useEffect(() => {
    autoPlayRef.current = nextSlide;
  });

  useEffect(() => {
    const play = () => {
      autoPlayRef.current();
    };

    // Every 4 seconds slider auto transition korbe
    const interval = setInterval(play, 4000);
    return () => clearInterval(interval);
  }, []);

  // ─── ২. TOUCH SWIPE LOGIC (MOBILE VIEW FEATURE) ───
  const onTouchStart = (e) => {
    setTouchEnd(null); // Reset
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide(); // Bame swipe korle porer slide
    } else if (isRightSwipe) {
      prevSlide(); // Dane swipe korle ager slide
    }
  };

  return (
    <div 
      className="relative w-full h-[60vh] md:h-[80vh] bg-gray-900 overflow-hidden select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides Wrapper */}
      <div 
        className="flex w-full h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="w-full h-full flex-shrink-0 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${slide.bgImage})` }}
          >
            {/* Dark Dark Overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content Inside Slide */}
            <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-12 md:px-24 text-white max-w-4xl z-10">
              <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-gray-300 mb-2 animate-fade-in">
                {slide.subtitle}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-wide leading-tight mb-6">
                {slide.title}
              </h1>
              <Link
                to={slide.link}
                className="bg-white text-black text-xs md:text-sm font-bold uppercase tracking-wider px-6 py-3 rounded-md hover:bg-black hover:text-white transition-all duration-300 shadow-lg"
              >
                {slide.ctaText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ─── ৩. CONTROLS: DESKTOP ARROWS ─── */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute top-1/2 left-4 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute top-1/2 right-4 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ─── ৪. BOTTOM NAVIGATION DOTS ─── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 transition-all duration-300 rounded-full ${
              currentIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
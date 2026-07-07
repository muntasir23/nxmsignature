import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { doc, getDoc } from 'firebase/firestore';
import { useCart } from '../context/Cartcontext';
import { db } from '../firebase/firebase.config';


export default function ProductDetailsPage() {
  // 🔥 FIX: Apnar routing match rule dynamic parameter (:id) structure map kora holo
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ─── VARIABLE CORE STATES ───
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    const fetchSingleProductData = async () => {
      // Logic safety check target system id validations
      if (!id) return;
      
      try {
        setLoading(true);
        // 🔥 Target variable exact string parameter load parameters check bind
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const data = productSnap.data();
          setProduct({ id: productSnap.id, ...data });
          
          // Image index block setup updates logic stream 
          if (data.images && data.images.length > 0) {
            setMainImage(data.images[0]);
          } else if (data.image) {
            // Backup handle single key variable configurations logic strings
            setMainImage(data.image);
          }
        } else {
          console.error("Target item identity node missing database layers!");
          alert("Product target context not found.");
          navigate('/shop');
        }
      } catch (err) {
        console.error("Firebase single product indexing trace error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleProductData();
  }, [id, navigate]);

  const handleQuantityAdjustment = (value) => {
    if (quantity + value < 1) return;
    setQuantity(prev => prev + value);
  };

  const handleAddToCartWithMetadata = () => {
    if (!product) return;
    // Sequential item stack counter payload triggers
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize);
    }
    alert(`🎉 Added ${quantity} item(s) [Size: ${selectedSize}] to your Bag!`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 font-sans mt-16 animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-slate-100 aspect-[3/4] rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 bg-slate-100 w-2/3 rounded-md" />
            <div className="h-4 bg-slate-100 w-1/3 rounded-md" />
            <div className="h-24 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 font-sans antialiased min-h-screen">
      
      {/* Return Back Button Navigation */}
      <button 
        onClick={() => navigate('/shop')} 
        className="mb-6 text-xs font-black uppercase text-gray-400 hover:text-slate-900 tracking-widest flex items-center gap-1.5 transition-all"
      >
        ← Return To Collection Directory
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        
        {/* ─── LEFT GALLERY INTERACTION CONTROLLER ─── */}
        <div className="space-y-4">
          {/* Active Primary Core View Frame Showcase */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden bg-slate-50/50 shadow-sm">
            {mainImage ? (
              <img 
                src={mainImage} 
                alt={product.title} 
                className="w-full h-full object-cover transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-gray-400 uppercase">No Image Logged</div>
            )}
          </div>

          {/* Bottom Grid Thumbnails Interface Active Selector Loop */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((imgUrl, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setMainImage(imgUrl)}
                  className={`w-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    mainImage === imgUrl ? 'border-[#5d655f] scale-95 shadow-sm' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <img src={imgUrl} alt={`Nexmode segment thumb ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── RIGHT PANEL LAYER: METADATA PANEL DETAILS ─── */}
        <div className="space-y-6 lg:py-2">
          <div>
            <span className="text-[10px] font-black uppercase bg-[#5d655f]/10 text-[#5d655f] px-2 py-0.5 rounded tracking-widest inline-block mb-2">
              {product.category || 'Streetwear'} Edition Standard
            </span>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-wide leading-tight">
              {product.title}
            </h1>
            <p className="text-xl font-black text-slate-900 tracking-tight mt-2">৳{product.price}</p>
          </div>

          {/* Description Block Statements */}
          {product.description && (
            <div className="border-t border-b border-dashed border-gray-100 py-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Product Details & Specs</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {/* Sizing Interactive Matrices Controls Grid */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Select Fit Size:</h4>
              <button 
                type="button"
                onClick={() => setShowSizeChart(true)}
                className="text-[10px] font-black uppercase tracking-wider text-[#5d655f] hover:underline"
              >
                📐 View Size Chart Grid
              </button>
            </div>
            
            <div className="flex gap-2">
              {sizeOptions.map(sz => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all border flex items-center justify-center ${
                    selectedSize === sz 
                      ? 'bg-[#5d655f] border-[#5d655f] text-white shadow-sm scale-102' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-slate-50'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Value Increment Modules Counter Component Triggers */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Select Order Quantity:</h4>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Plus Minus Numeric Row Box Controller */}
              <div className="flex items-center justify-between border border-gray-200 bg-slate-50/50 rounded-xl p-1 w-full sm:w-32 h-12 flex-shrink-0">
                <button 
                  type="button" 
                  onClick={() => handleQuantityAdjustment(-1)}
                  className="w-9 h-9 bg-white border border-gray-100 rounded-lg flex items-center justify-center font-black text-xs text-slate-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                >
                  -
                </button>
                <span className="text-xs font-black font-mono text-slate-800 w-8 text-center">{quantity}</span>
                <button 
                  type="button" 
                  onClick={() => handleQuantityAdjustment(1)}
                  className="w-9 h-9 bg-white border border-gray-100 rounded-lg flex items-center justify-center font-black text-xs text-slate-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Processing Trigger button */}
              <button
                type="button"
                onClick={handleAddToCartWithMetadata}
                className="flex-1 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow flex items-center justify-center gap-2 py-5"
              >
                Add To Cart Package 🛒
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ─── APPAREL DIMENSIONS MODAL DRAWER SHEET ─── */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Nexmode Size Guide</h3>
              <button onClick={() => setShowSizeChart(false)} className="text-gray-400 font-bold hover:text-black">✕</button>
            </div>
            
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase font-black tracking-wider text-slate-500">
                    <th className="p-2.5 border">Size</th>
                    <th className="p-2.5 border">Chest (Inches)</th>
                    <th className="p-2.5 border">Length (Inches)</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-700">
                  <tr className="border-b"><td className="p-2.5 border font-bold">S</td><td className="p-2.5 border">৩৮</td><td className="p-2.5 border">২৭</td></tr>
                  <tr className="border-b bg-slate-50/30"><td className="p-2.5 border font-bold">M</td><td className="p-2.5 border">৪০</td><td className="p-2.5 border">২৮</td></tr>
                  <tr className="border-b"><td className="p-2.5 border font-bold">L</td><td className="p-2.5 border">৪২</td><td className="p-2.5 border">২৯</td></tr>
                  <tr className="border-b bg-slate-50/30"><td className="p-2.5 border font-bold">XL</td><td className="p-2.5 border">৪৪</td><td className="p-2.5 border">৩০</td></tr>
                  <tr className="border-b"><td className="p-2.5 border font-bold">XXL</td><td className="p-2.5 border">৪৬</td><td className="p-2.5 border">৩১</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-gray-400 mt-3 italic">💡 Tip: Measuring variance can fluctuate up to 0.5 inches safely.</p>
          </div>
        </div>
      )}

    </div>
  );
}
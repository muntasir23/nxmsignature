import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('default');
  const [priceRange, setPriceRange] = useState(3000);

  // 🎯 Exact Categories Mapping Array configured from your options
  const categories = [
    { label: 'All Collections', value: 'All' },
    { label: 'Full Sleeve Shirt', value: 'full-sleeve-shirt' },
    { label: 'Half Sleeve Shirt', value: 'half-sleeve-shirt' },
    { label: 'Remi Cotton Shirt', value: 'remi-cotton-shirt' },
    { label: 'Q Ban Shirt', value: 'q-ban-shirt' },
    { label: 'Formal Trouser', value: 'formal-trouser' },
    { label: 'Cotton Pant', value: 'cotton-pant' },
    { label: 'Trouser', value: 'trouser' },
    { label: 'T-Shirt', value: 't-shirt' },
    { label: 'Polo', value: 'polo' }
  ];

  // 1. Initial Firebase Data Fetching Run
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const list = [];
        querySnapshot.forEach(doc => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setProducts(list);
        setFilteredProducts(list);
      } catch (err) {
        console.error("Error fetching shop data: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // 2. Real-Time Frontend Filter & Sorting Algorithm (Updated)
  useEffect(() => {
    let updatedList = [...products];

    // Filter by Category Selection Logic
    if (selectedCategory !== 'All') {
      updatedList = updatedList.filter(item => 
        item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Price Range Slider
    updatedList = updatedList.filter(item => Number(item.price) <= priceRange);

    // Sorting Calculation Engine
    if (selectedSort === 'lowToHigh') {
      updatedList.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (selectedSort === 'highToLow') {
      updatedList.sort((a, b) => Number(b.price) - Number(a.price));
    }

    setFilteredProducts(updatedList);
  }, [selectedCategory, selectedSort, priceRange, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans antialiased">
      
      {/* Page Main Header Banner */}
      <div className="text-center md:text-left mb-10 border-b border-gray-100 pb-6">
        <span className="text-[10px] font-black tracking-[0.25em] text-[#5d655f] uppercase block mb-1">Nexmode Collections</span>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-wide">Shop Catalog</h1>
        <p className="text-xs text-gray-400 mt-1">Found {filteredProducts.length} Premium Essentials</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ─── LEFT SIDEBAR: NEW CATEGORIES LIST CONTROL PANEL ─── */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-8 bg-slate-50/50 p-5 rounded-2xl border border-gray-100 h-fit">
          
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4 pb-2 border-b border-gray-200">
              Categories
            </h3>
            {/* Scrollable button layer for mobile devices, clean grid layout list */}
            <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`whitespace-nowrap text-left px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex-shrink-0 ${
                    selectedCategory === cat.value
                      ? 'bg-[#5d655f] text-white shadow-sm'
                      : 'text-gray-600 bg-white lg:bg-transparent hover:bg-white hover:text-slate-900 border border-gray-100/70 lg:border-transparent hover:border-gray-100 shadow-sm lg:shadow-none'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Range Slider Controller */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">
                Max Price
              </h3>
              <span className="text-xs font-black text-[#5d655f]">৳{priceRange}</span>
            </div>
            <input
              type="range"
              min="300"
              max="5000"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#5d655f] bg-gray-200 rounded-lg h-1 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2 uppercase">
              <span>৳300</span>
              <span>৳5000</span>
            </div>
          </div>

          {/* Reset Action Button */}
          <button 
            onClick={() => { setSelectedCategory('All'); setPriceRange(3000); setSelectedSort('default'); }}
            className="w-full py-3 bg-white hover:bg-slate-950 border border-gray-200 hover:border-slate-950 text-slate-900 hover:text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-sm"
          >
            Clear All Filters
          </button>
        </div>

        {/* ─── RIGHT SIDEBAR: CONTROLS & PRODUCT GRID ─── */}
        <div className="flex-1">
          
          {/* Top Sorting Bar Panel */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 mb-6 border border-gray-100 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Showing active items: <span className="text-slate-900 font-black">{filteredProducts.length} results</span>
            </span>
            
            {/* Sorting Dropdown Selection */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 whitespace-nowrap">Sort By:</label>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="w-full sm:w-48 bg-slate-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 uppercase tracking-wide focus:outline-none focus:ring-1 focus:ring-[#5d655f]"
              >
                <option value="default">Default (Newest)</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Loader / Product Grid Display */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-pulse mt-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-50 aspect-[3/4] rounded-2xl border border-gray-100" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-slate-50/50 rounded-2xl border border-dashed border-gray-200 mt-4">
              <span className="text-3xl block mb-2">🔍</span>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">No Products Found</h3>
              <p className="text-xs text-gray-400 mt-1">Try resetting selected filters or increasing maximum price caps.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-50">
                    <img 
                      src={product.images?.[0] || 'https://via.placeholder.com/600x800'} 
                      alt={product.title} 
                      className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="p-4 border-t border-gray-50 flex flex-col justify-between flex-grow">
                    <div>
                      <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest block mb-1">
                        {categories.find(c => c.value === product.category)?.label || product.category || 'Apparel'}
                      </span>
                      <h2 className="text-xs font-bold text-slate-800 tracking-wide line-clamp-2 min-h-[2rem] leading-snug">
                        {product.title}
                      </h2>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 mt-2 border-t border-dashed border-gray-100">
                      <span className="text-sm font-black text-slate-900 tracking-tight">
                        ৳{product.price}
                      </span>
                      <a 
                        href={`/product/${product.id}`}
                        className="bg-slate-900 hover:bg-black text-white p-2 rounded-lg transition-colors shadow-sm"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
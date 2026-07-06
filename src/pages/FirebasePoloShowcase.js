import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

export default function FirebasePoloShowcase() {
  // Database State Hooks
  const [poloList, setPoloList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Interface Control States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Protiti page-e koita polo product dekhabe config setting

  // ─── ১. FIREBASE FIRESTORE POLO ONLY DATA QUERY ───
  useEffect(() => {
    const fetchPolosFromFirebase = async () => {
      try {
        setLoading(true);
        const productsCollectionRef = collection(db, "products");
        
        // 🚨 Shudhu category "polo" match kora hocche direct query-te
        const q = query(
          productsCollectionRef, 
          where("category", "==", "polo")
        );
        
        const querySnapshot = await getDocs(q);
        
        const fetchedItems = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() });
        });

        // 🚨 Safely frontend-e shorting execute kora hocche (Newest first)
        fetchedItems.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        setPoloList(fetchedItems);
      } catch (error) {
        console.error("Firestore loading failure context:", error);
        alert("Polo data load hote somossa hoyeche! Console check kuurn.");
      } finally {
        setLoading(false);
      }
    };

    fetchPolosFromFirebase();
  }, []);

  // ─── ২. PAGINATION MATH ───
  const totalItems = poloList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPolos = poloList.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-xs font-semibold text-gray-400 uppercase tracking-widest">
        Loading Polo Collection...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans antialiased">
      
      {/* Header Panel */}
      <div className="border-b border-gray-100 pb-5 mb-8">
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wide">Nexmode Polo Catalog</h2>
        <p className="text-xs text-gray-400 mt-1">Total Premium Polos Available: {totalItems}</p>
      </div>

      {/* ─── ৩. PRODUCT CARD MAPPING GRID ─── */}
      {currentPolos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPolos.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden">
                <img
                  src={product.images && product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-slate-900 text-white text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded shadow">
                  {product.category}
                </span>
              </div>

              {/* Data Description Body */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <h3 className="text-sm font-bold text-gray-800 tracking-wide line-clamp-2 mb-4 group-hover:text-indigo-600 transition-colors">
                  {product.title}
                </h3>
                
                <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-100">
                  <span className="text-xs font-bold text-gray-400">Price</span>
                  <span className="text-base font-black text-gray-900">৳{product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-xs font-medium">
          No polo shirts found in your database. Please check if category name is "polo".
        </div>
      )}

      {/* ─── ৪. PAGINATION CONTROLS ─── */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-12">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-slate-50 disabled:opacity-40 transition-all"
          >
            ←
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-9 h-9 text-xs font-bold rounded-xl border transition-all ${
                  currentPage === pageNum
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-slate-50 disabled:opacity-40 transition-all"
          >
            →
          </button>
        </div>
      )}

    </div>
  );
}
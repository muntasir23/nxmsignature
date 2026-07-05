import React, { useState } from 'react';
// Firebase configurations (Apnar file path tracking onujayi config import korben)

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

export default function NexmodeCustomerLookup() {
  const [searchPhone, setSearchPhone] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!searchPhone.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      // 1. Direct fetch from Firebase using Phone as the Document ID
      const docRef = doc(db, "loyalty_users", searchPhone.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCustomerData(docSnap.data());
      } else {
        // Document na paile status null thakbe
        setCustomerData(null);
      }
    } catch (error) {
      console.error("Firebase fetch error:", error);
      alert("Database connection issues. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Formatting Firestore timestamp safely to standard readable date
  const formatSyncDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const dateObj = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Helper variables for layout rendering
  const stamps = customerData?.currentStamps || 0;
  const cycles = customerData?.totalCycles || 0;
  const remaining = 11 - stamps;

  // Formatting strings into "01/11", "07/11" style padding layout
  const formattedProgressString = `${stamps.toString().padStart(2, '0')}/11`;

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen p-4 font-sans antialiased shadow-xl rounded-2xl border border-gray-200">
      
      {/* SECTION 1: SEARCH TRACKING PANEL */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-5">
        <h2 className="text-sm font-black text-gray-800 tracking-wider uppercase mb-3 flex items-center gap-1.5">
          <span>🔍</span> Check Your Rewards Status
        </h2>
        
        <form onSubmit={handleLookup} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter Phone Number (e.g. 0197332807)" 
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="flex-1 text-xs font-semibold border border-gray-200 px-3 py-2.5 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-inner"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase px-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            {loading ? '...' : 'Search'}
          </button>
        </form>
      </div>

      {/* SECTION 2: DYNAMIC CUSTOMER CARD SYSTEM DISPLAY */}
      {loading ? (
        <div className="text-center py-10 text-xs text-gray-400 font-bold tracking-wide animate-pulse">
          Fetching live profile from Nexmode cloud system...
        </div>
      ) : hasSearched && !customerData ? (
        <div className="bg-white p-6 rounded-2xl border border-dashed border-gray-200 text-center text-xs text-gray-400 font-bold">
          ❌ No records found for this phone identity.
        </div>
      ) : hasSearched && customerData ? (
        
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-md relative overflow-hidden">
          
          {/* Header Row */}
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">✓</div>
              <h3 className="font-black text-gray-800 text-base tracking-tight">NEXMODE Rewards</h3>
            </div>
            <span className="bg-blue-50 text-blue-600 text-xs font-black px-2.5 py-0.5 rounded-full border border-blue-100 font-mono">
              {formattedProgressString}
            </span>
          </div>

          {/* Identity & Issue Date Layout fields */}
          <div className="space-y-0.5 mb-4">
            <p className="text-xs font-black text-gray-700">Name: <span className="font-bold text-gray-500">{customerData.name || 'Valued Guest'}</span></p>
            <p className="text-[11px] text-gray-400 font-mono tracking-wide">Phone: {customerData.phone}</p>
            <p className="text-[10px] text-gray-400/90 font-medium">Issue Date / Last Sync: {formatSyncDate(customerData.lastUpdated)}</p>
          </div>

          {/* Smooth Linear Progress Bar Panel */}
          <div className="mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1.5">
              <span>Progress Status</span>
              <span className="text-blue-600 font-mono">
                {remaining === 0 ? "🎉 Free Gift Active!" : `${remaining} cards left`}
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-500 ease-out" 
                style={{ width: `${(stamps / 11) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* 1 TO 11 CIRCLE STAMP LAYOUT MATRIX GRID */}
          <div className="grid grid-cols-6 gap-x-2 gap-y-3.5 mb-5 px-1">
            {[...Array(11)].map((_, index) => {
              const currentNum = index + 1;
              const isFilled = stamps >= currentNum;
              const isGiftSlot = currentNum === 11;

              return (
                <div key={index} className="flex flex-col items-center justify-center">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isFilled 
                      ? 'bg-blue-50 text-blue-600 border-blue-400 font-black scale-105 shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-300 font-bold'
                  } text-xs font-mono`}>
                    {isGiftSlot ? '🎁' : currentNum}
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold mt-1 tracking-tight">
                    {isGiftSlot ? 'Free' : currentNum}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Summary Footer tracking total metrics rewards claimed */}
          <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-xl flex items-center justify-between">
            <div className="text-xs text-emerald-800 font-bold leading-none">
              Completed Reward Cycles:
            </div>
            <span className="bg-emerald-600 text-white font-black font-mono px-3 py-1 rounded-lg text-xs shadow-sm">
              🎁 {cycles} Claimed
            </span>
          </div>

        </div>
      ) : (
        /* Empty entry state overlay guide */
        <div className="bg-gray-100/50 border border-dashed border-gray-200 p-10 text-center text-xs text-gray-400 rounded-2xl font-medium leading-relaxed">
          👋 Welcome! Enter your purchase phone directory reference to see your active reward tracking system profile instantly.
        </div>
      )}

    </div>
  );
}
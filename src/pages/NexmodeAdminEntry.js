import React, { useState } from 'react';
// 1. Firebase Firestore SDK methods initialization

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

export default function NexmodeAdminStation() {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [productQty, setProductQty] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminFormSubmit = async (e) => {
    e.preventDefault();
    
    // Inputs Validation Check
    if (!customerPhone || !productQty || !customerName) return;
    const addedQty = parseInt(productQty, 10);
    if (isNaN(addedQty) || addedQty <= 0) return;

    setLoading(true);

    try {
      // 2. Firebase Database Reference setup using Phone number as Unique Document ID
      const docRef = doc(db, "loyalty_users", customerPhone.trim());
      const docSnap = await getDoc(docRef);

      let finalCycles = 0;
      let finalStamps = 0;

      if (docSnap.exists()) {
        // CASE A: Customer matching record found! Retrieve existing totals
        const existingData = docSnap.data();
        const prevStamps = existingData.currentStamps || 0;
        const prevCycles = existingData.totalCycles || 0;

        // 3. Absolute Cumulative total calculation
        const absoluteTotal = (prevCycles * 11) + prevStamps + addedQty;
        
        // 11 cycle limit parsing formula logic
        finalCycles = Math.floor(absoluteTotal / 11);
        finalStamps = absoluteTotal % 11;

      } else {
        // CASE B: Completely brand new registration path
        finalCycles = Math.floor(addedQty / 11);
        finalStamps = addedQty % 11;
      }

      // 4. Writing & Syncing back to Firebase
      // merge: true condition ensures database updates smoothly without erasing other keys
      await setDoc(docRef, {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        totalCycles: finalCycles,
        currentStamps: finalStamps,
        lastUpdated: new Date()
      }, { merge: true });

      alert(`🎉 Data Synced Successfully!\nTotal Cycles: ${finalCycles}\nCurrent Stamps: ${finalStamps}/11`);
      
      // Cleanup Input States except Customer Data focus fields
      setProductQty('');
      
    } catch (error) {
      console.error("Firebase Sync Error: ", error);
      alert("Database issue! Connection update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-50 p-4 font-sans antialiased">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md">
        
        {/* Module Header Badge */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-xs font-black text-gray-800 uppercase tracking-wider">
            <span>⚙️</span> Nexmode Admin Terminal
          </div>
          <span className="bg-orange-50 text-orange-600 text-[9px] font-black px-2 py-0.5 rounded border border-orange-100 uppercase tracking-widest">
            Staff Only
          </span>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed mb-4">
          Enter customer details to instantly sync loyalty points inside centralized Firebase document ledger.
        </p>

        {/* Core Operations Form Block */}
        <form onSubmit={handleAdminFormSubmit} className="space-y-4">
          
          {/* Input 1: Customer Name */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Customer Name
            </label>
            <input 
              type="text" 
              placeholder="e.g. S. Rahman" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full text-xs font-medium border border-gray-200 px-3 py-2.5 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              required
            />
          </div>

          {/* Input 2: Mobile Number */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Mobile Phone Number
            </label>
            <input 
              type="text" 
              placeholder="e.g. 0197332807" 
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full text-xs font-medium border border-gray-200 px-3 py-2.5 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-inner"
              required
            />
          </div>

          {/* Input 3: Quantity Additions */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Issued Product Qty (+Cards)
            </label>
            <input 
              type="number" 
              placeholder="How many items? (e.g. 1, 4, 13)" 
              value={productQty}
              onChange={(e) => setProductQty(e.target.value)}
              className="w-full text-xs font-medium border border-gray-200 px-3 py-2.5 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-inner"
              required
            />
          </div>

          {/* Submit Action Control */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full text-white text-xs font-black tracking-wider uppercase py-3 rounded-xl shadow-md transition-all ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed animate-pulse' 
                : 'bg-slate-900 hover:bg-slate-800 active:scale-[0.99]'
            }`}
          >
            {loading ? 'Processing Database Link...' : 'Commit & Update Document'}
          </button>
        </form>

      </div>
    </div>
  );
}
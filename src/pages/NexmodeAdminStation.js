import React, { useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

export default function NexmodeAdminStation() {
  // Input Form States
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [productQty, setProductQty] = useState('');
  
  // Terminal System States
  const [loading, setLoading] = useState(false);
  const [searchedCustomer, setSearchedCustomer] = useState(null);
  const [searchPhone, setSearchPhone] = useState('');

  // ─── ১. STAMPS UPDATE / ISSUE HANDLER ───
  const handleAdminFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!customerPhone || !productQty || !customerName) return;
    const addedQty = parseInt(productQty, 10);
    if (isNaN(addedQty) || addedQty <= 0) return;

    setLoading(true);

    try {
      const docRef = doc(db, "loyalty_users", customerPhone.trim());
      const docSnap = await getDoc(docRef);

      let finalCycles = 0;
      let finalStamps = 0;
      let existingClaimed = 0;
      let isExpired = false;

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        existingClaimed = existingData.claimedRewards || 0;

        // ১ বছরের মেয়াদ ভ্যালিডেশন চেক
        if (existingData.lastUpdated) {
          const lastUpdatedDate = existingData.lastUpdated.seconds 
            ? new Date(existingData.lastUpdated.seconds * 1000) 
            : new Date(existingData.lastUpdated);
          
          const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
          const timeDifference = new Date() - lastUpdatedDate;

          if (timeDifference >= oneYearInMs) {
            isExpired = true;
          }
        }

        if (isExpired) {
          finalCycles = Math.floor(addedQty / 11);
          finalStamps = addedQty % 11;
          existingClaimed = 0; // Expiry hole counter block flush zero validation
        } else {
          const prevStamps = existingData.currentStamps || 0;
          const prevCycles = existingData.totalCycles || 0;
          const absoluteTotal = (prevCycles * 11) + prevStamps + addedQty;

          finalCycles = Math.floor(absoluteTotal / 11);
          finalStamps = absoluteTotal % 11;
        }

      } else {
        finalCycles = Math.floor(addedQty / 11);
        finalStamps = addedQty % 11;
      }

      const updatePayload = {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        totalCycles: finalCycles,
        currentStamps: finalStamps,
        claimedRewards: existingClaimed,
        lastUpdated: new Date()
      };

      if (isExpired) {
        await setDoc(docRef, updatePayload); 
      } else {
        await setDoc(docRef, updatePayload, { merge: true }); 
      }

      // Auto update active visual profile dashboard view if open
      if (searchedCustomer && searchedCustomer.phone === customerPhone.trim()) {
        setSearchedCustomer(updatePayload);
      }

      alert(isExpired 
        ? `⚠️ Account Expired! Card history reset.\nNew Cycles: ${finalCycles}` 
        : `🎉 Data Synced!\nTotal Cycles: ${finalCycles}\nCurrent Stamps: ${finalStamps}/11`
      );
      
      setProductQty('');
      
    } catch (error) {
      console.error("Firebase Sync Error: ", error);
      alert("Database error! Sync failed.");
    } finally {
      setLoading(false);
    }
  };

  // ─── ২. REWARD SEARCH HANDLER ───
  const handleSearchCustomer = async (e) => {
    e.preventDefault();
    if (!searchPhone) return;

    setLoading(true);
    setSearchedCustomer(null);

    try {
      const docRef = doc(db, "loyalty_users", searchPhone.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSearchedCustomer(docSnap.data());
      } else {
        alert("Ei number e kono customer পাওয়া যায়নি!");
      }
    } catch (error) {
      console.error(error);
      alert("Fetch validation check error!");
    } finally {
      setLoading(false);
    }
  };

  // ─── ৩. CLAIM REWARD HANDLER ───
  const handleClaimRewardAction = async () => {
    if (!searchedCustomer) return;

    const claimed = searchedCustomer.claimedRewards || 0;
    const available = searchedCustomer.totalCycles - claimed;

    if (available <= 0) {
      alert("Ei customer er available kono reward baki nei!");
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, "loyalty_users", searchedCustomer.phone);
      const updatedClaimedCount = claimed + 1;

      await setDoc(docRef, {
        claimedRewards: updatedClaimedCount
      }, { merge: true });

      // Local component live visual sync update
      setSearchedCustomer(prev => ({
        ...prev,
        claimedRewards: updatedClaimedCount
      }));

      alert("🎉 1 Reward successfully claimed and recorded!");
    } catch (error) {
      console.error(error);
      alert("Reward dispatch verification field failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-slate-50 p-6 font-sans antialiased grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* ─── COLUMN 1: STAMPS ADD TERMINAL ─── */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-xs font-black text-gray-800 uppercase tracking-wider">
              <span>⚙️</span> Issue Stamps Terminal
            </div>
            <span className="bg-orange-50 text-orange-600 text-[9px] font-black px-2 py-0.5 rounded border border-orange-100 uppercase tracking-widest">
              Staff Only
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Enter shopping criteria. System auto-calculates cycles matrix based on dynamic 11-stamps parameters.
          </p>

          <form onSubmit={handleAdminFormSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Customer Name</label>
              <input 
                type="text" placeholder="e.g. S. Rahman" value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs font-medium border border-gray-200 px-3 py-2.5 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner" required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Mobile Phone Number</label>
              <input 
                type="text" placeholder="e.g. 0197332807" value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full text-xs font-medium border border-gray-200 px-3 py-2.5 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-inner" required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Issued Product Qty</label>
              <input 
                type="number" placeholder="Quantity (e.g. 1, 4, 11)" value={productQty}
                onChange={(e) => setProductQty(e.target.value)}
                className="w-full text-xs font-medium border border-gray-200 px-3 py-2.5 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-inner" required
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className={`w-full text-white text-xs font-black tracking-wider uppercase py-3 rounded-xl shadow-md transition-all ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 active:scale-[0.99]'
              }`}
            >
              {loading ? 'Processing...' : 'Commit & Update Document'}
            </button>
          </form>
        </div>
      </div>

      {/* ─── COLUMN 2: REWARD DISPATCH / SEARCH MANAGER ─── */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-xs font-black text-gray-800 uppercase tracking-wider">
              <span>🎁</span> Rewards Dispatch Panel
            </div>
            <span className="bg-green-50 text-green-600 text-[9px] font-black px-2 py-0.5 rounded border border-green-100 uppercase tracking-widest">
              Live Query
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Search subscriber phone profile database records to safely execute available items allocation procedures.
          </p>

          <form onSubmit={handleSearchCustomer} className="flex gap-2 mb-6">
            <input 
              type="text" placeholder="Enter Customer Phone" value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="flex-1 text-xs font-mono border border-gray-200 px-3 py-2.5 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner" required
            />
            <button 
              type="submit" disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 rounded-xl transition-all"
            >
              Search
            </button>
          </form>

          {/* Profile Details Template View */}
          {searchedCustomer ? (
            <div className="border border-dashed border-gray-200 rounded-xl p-4 bg-slate-50/50">
              <h4 className="text-sm font-bold text-gray-800">{searchedCustomer.name}</h4>
              <p className="text-[11px] font-mono text-gray-400 mb-4">ID Reference: {searchedCustomer.phone}</p>

              {/* Data Dashboard Grid */}
              <div className="grid grid-cols-3 gap-2 text-center mb-6">
                <div className="bg-white p-2 rounded-lg border border-gray-100">
                  <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wide">Total Earned</span>
                  <span className="text-base font-black text-slate-800">{searchedCustomer.totalCycles || 0}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-100">
                  <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wide">Claimed</span>
                  <span className="text-base font-black text-amber-600">{searchedCustomer.claimedRewards || 0}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-100">
                  <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wide">Available</span>
                  <span className="text-base font-black text-emerald-600">
                    {(searchedCustomer.totalCycles || 0) - (searchedCustomer.claimedRewards || 0)}
                  </span>
                </div>
              </div>

              {/* Dynamic Status Progress Alert */}
              <div className="bg-white p-2.5 rounded-lg border border-gray-100 text-[11px] text-gray-500 font-medium mb-4 flex justify-between">
                <span>Current Stamp Progress:</span>
                <span className="font-bold text-indigo-600">{searchedCustomer.currentStamps || 0} / 11 Stamps</span>
              </div>

              <button
                type="button"
                onClick={handleClaimRewardAction}
                disabled={loading || ((searchedCustomer.totalCycles || 0) - (searchedCustomer.claimedRewards || 0) <= 0)}
                className="w-full py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 rounded-xl transition-all shadow-sm"
              >
                {((searchedCustomer.totalCycles || 0) - (searchedCustomer.claimedRewards || 0) <= 0) 
                  ? 'No Rewards Available' 
                  : 'Confirm & Claim 1 Reward'
                }
              </button>
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">
              No live query active. Search phone number to dispatch.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
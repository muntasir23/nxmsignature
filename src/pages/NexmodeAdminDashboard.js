import React, { useState, useEffect } from 'react';
// Firebase configurations (Apnar file configuration profile onujayi db component dhorben)

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

export default function NexmodeAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [customerList, setCustomerList] = useState([]);

  // Live Real-time stats variables counters
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalCompletedCycles: 0,
    activeStampsInPool: 0
  });

  // 1. REAL-TIME WHOLE COLLECTION LISTENER PIPELINE
  useEffect(() => {
    // Loyalty users collection reference path tracking
    const usersCollectionRef = collection(db, "loyalty_users");

    const unsubscribe = onSnapshot(usersCollectionRef, (querySnapshot) => {
      const usersDataArray = [];
      let aggregateCycles = 0;
      let aggregateStamps = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        usersDataArray.push({ id: doc.id, ...data });

        // Real-time addition computation across all entries
        aggregateCycles += data.totalCycles || 0;
        aggregateStamps += data.currentStamps || 0;
      });

      // Sync state array data
      setCustomerList(usersDataArray);

      // Compute total analytics
      setStats({
        totalCustomers: querySnapshot.size, // Unique registered users context
        totalCompletedCycles: aggregateCycles, // Total cycles count completed globally
        activeStampsInPool: aggregateStamps
      });

      setLoading(false);
    }, (error) => {
      console.error("Dashboard Sync Error:", error);
      setLoading(false);
    });

    // Connection cleanup setup logic mapping bypass
    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-slate-50 min-h-screen p-4 font-sans antialiased">
      
      {/* BRAND SCREEN DASHBOARD TITLE ROW */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2">
            <span>📊</span> Nexmode Master Admin Panel
          </h1>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">Real-time Loyalty Ecosystem & Business Tracker Analytics</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
          <span className="text-[10px] font-black tracking-widest uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
            Live Stream Cloud Online
          </span>
        </div>
      </div>

      {/* METRICS DISPATCH WIDGET CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        
        {/* WIDGET 1: TOTAL LOYAL CUSTOMERS */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
          <span className="text-[10px] block font-black text-gray-400 uppercase tracking-widest mb-1">
            Total Loyal Customers
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 tracking-tight font-mono">
              {loading ? '...' : stats.totalCustomers}
            </span>
            <span className="text-xs font-bold text-gray-400">Registered</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-medium">👥 Total verified phone accounts</p>
        </div>

        {/* WIDGET 2: TOTAL COMPLETED CYCLES */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          <span className="text-[10px] block font-black text-gray-400 uppercase tracking-widest mb-1">
            Total Completed Cycles
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 tracking-tight font-mono">
              {loading ? '...' : stats.totalCompletedCycles}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Full Boxes</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-medium">🎁 11 stamp checkpoints crossed</p>
        </div>

        {/* WIDGET 3: LIVE ACTIVE COUNTER STAMPS IN POOL */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
          <span className="text-[10px] block font-black text-gray-400 uppercase tracking-widest mb-1">
            Active Stamps In Pool
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 tracking-tight font-mono">
              {loading ? '...' : stats.activeStampsInPool}
            </span>
            <span className="text-xs font-bold text-gray-400">Cards Live</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-medium">✨ Progress points current accumulation</p>
        </div>

      </div>

      {/* DETAILED LEDGER TABLE CUSTOMER SEGMENT LIST */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-xs font-black tracking-wider text-gray-500 uppercase">Customer Loyalty Ledger Directory</h3>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 font-bold rounded font-mono">
            Count: {customerList.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center text-xs text-gray-400 py-12 font-medium tracking-wide animate-pulse">
            Syncing matrix analytics with Firebase stream cloud...
          </div>
        ) : customerList.length === 0 ? (
          <div className="text-center text-xs text-gray-400 py-12 font-medium">
            No customer accounts found in central data module snapshot bucket.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-slate-50/20 text-[10px] uppercase font-black text-gray-400 tracking-wider">
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4 text-center">Completed Cycles (11x)</th>
                  <th className="py-3 px-4 text-center">Current Remaining Stamps</th>
                  <th className="py-3 px-4 text-right">Last Sync Event</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs text-gray-700 font-medium">
                {customerList.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-800">{user.name || 'Anonymous User'}</div>
                      <div className="text-[10px] text-gray-400 font-mono tracking-wide mt-0.5">{user.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block bg-emerald-50 text-emerald-700 font-black font-mono px-2.5 py-0.5 rounded-full text-[11px] border border-emerald-100 shadow-sm">
                        🎁 {user.totalCycles || 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="w-24 mx-auto bg-gray-100 h-2 rounded-full overflow-hidden shadow-inner mb-1">
                        <div 
                          className="bg-blue-500 h-full" 
                          style={{ width: `${((user.currentStamps || 0) / 11) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-black text-blue-600 font-mono">
                        {user.currentStamps || 0} / 11 Stamps
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-[10px] text-gray-400 font-mono">
                      {user.lastUpdated?.seconds 
                        ? new Date(user.lastUpdated.seconds * 1000).toLocaleDateString()
                        : 'No Data'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
import React, { useState, useEffect } from 'react';

import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  // ─── PAGINATION STATES ───
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10; // Proti page-e koita order thakbe

  // Load metrics logic structure array mapping template
  const fetchAllOrdersForAdmin = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "cart_sessions"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const itemsList = [];
      snapshot.forEach(doc => {
        itemsList.push({ id: doc.id, ...doc.data() });
      });
      setOrders(itemsList);
    } catch (err) {
      console.error("Firebase admin system logging index exception:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrdersForAdmin();
  }, []);

  // Filter change hole auto prothom page-e niye jabe
  const handleFilterChange = (filterName) => {
    setActiveFilter(filterName);
    setCurrentPage(1); 
  };

  // Update Specific Status Node Action Logic
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "cart_sessions", orderId);
      await updateDoc(orderRef, { status: newStatus });
      
      // Real-time state update triggers
      setOrders(prev => prev.map(item => 
        item.id === orderId ? { ...item, status: newStatus } : item
      ));
      alert(`💼 Order status successfully updated to: ${newStatus}`);
    } catch (error) {
      console.error("Database update sequence error:", error);
      alert("Failed to sync structural routing payload target configuration.");
    }
  };

  // Counting Indicators Analytic Engine Structure Modules
  const countPending = orders.filter(o => o.status === 'Pending' || !o.status).length;
  const countConfirmed = orders.filter(o => o.status === 'Confirmed').length;
  const countDelivered = orders.filter(o => o.status === 'Delivered').length;
  const countCancelled = orders.filter(o => o.status === 'Cancelled').length;

  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Pending') return order.status === 'Pending' || !order.status;
    return order.status === activeFilter;
  });

  // ─── PAGINATION LOGIC CALCULATIONS ───
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans antialiased mt-16 min-h-screen">
      
      {/* Admin Panel Header Block Layout */}
      <div className="mb-8 text-center md:text-left border-b pb-4">
        <span className="text-[10px] font-black uppercase bg-slate-900 text-white px-2.5 py-1 rounded tracking-widest">Nexmode Command Center</span>
        <h1 className="text-2xl font-black text-slate-900 uppercase mt-2 tracking-wide">Order Management Administration Terminal</h1>
      </div>

      {/* Dynamic System Metrics Summary Widget Boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div onClick={() => handleFilterChange('Pending')} className={`p-4 border rounded-2xl cursor-pointer transition-all ${activeFilter === 'Pending' ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-300' : 'bg-white hover:bg-slate-50'}`}>
          <span className="text-[10px] font-black uppercase text-gray-400 block">Pending Reviews</span>
          <span className="text-2xl font-black text-amber-600">{countPending}</span>
        </div>
        <div onClick={() => handleFilterChange('Confirmed')} className={`p-4 border rounded-2xl cursor-pointer transition-all ${activeFilter === 'Confirmed' ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-300' : 'bg-white hover:bg-slate-50'}`}>
          <span className="text-[10px] font-black uppercase text-gray-400 block">Confirmed Process</span>
          <span className="text-2xl font-black text-blue-600">{countConfirmed}</span>
        </div>
        <div onClick={() => handleFilterChange('Delivered')} className={`p-4 border rounded-2xl cursor-pointer transition-all ${activeFilter === 'Delivered' ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300' : 'bg-white hover:bg-slate-50'}`}>
          <span className="text-[10px] font-black uppercase text-gray-400 block">Recieved / Delivered</span>
          <span className="text-2xl font-black text-emerald-600">{countDelivered}</span>
        </div>
        <div onClick={() => handleFilterChange('Cancelled')} className={`p-4 border rounded-2xl cursor-pointer transition-all ${activeFilter === 'Cancelled' ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-300' : 'bg-white hover:bg-slate-50'}`}>
          <span className="text-[10px] font-black uppercase text-gray-400 block">Cancelled Logs</span>
          <span className="text-2xl font-black text-rose-600">{countCancelled}</span>
        </div>
      </div>

      {/* Reset Filter Button Row layout component */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-black text-slate-800 uppercase tracking-wide">Showing:</span>
          <span className="text-xs font-black px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md uppercase tracking-wider">{activeFilter} Log Stream</span>
          {activeFilter !== 'All' && (
            <button onClick={() => handleFilterChange('All')} className="text-[10px] font-black text-red-500 hover:underline uppercase pl-2">Clear Filter</button>
          )}
        </div>
        <button onClick={fetchAllOrdersForAdmin} className="text-xs font-black border px-3 py-1.5 rounded-xl hover:bg-slate-50 uppercase tracking-wider">🔄 Sync Data</button>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-slate-50 border rounded-2xl" />)}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-2xl text-xs font-bold text-gray-400 uppercase tracking-widest">
          No records captured inside this system query directory.
        </div>
      ) : (
        /* Order Records Grid Lists */
        <div className="space-y-6">
          {currentOrders.map((order) => (
            <div key={order.id} className="bg-white border rounded-2xl shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between gap-6">
              
              {/* Order Info Head Matrix Area */}
              <div className="flex flex-wrap justify-between items-start gap-4 border-b pb-4">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block select-all">SYSTEM_ID: #{order.id}</span>
                  <h3 className="text-sm font-black text-slate-900 uppercase mt-1">Customer: {order.sessionIdentity?.customerName || 'N/A'}</h3>
                  <p className="text-xs font-bold text-slate-600">📞 Phone: <span className="font-mono select-all">{order.sessionIdentity?.phone}</span></p>
                  <p className="text-xs text-gray-500 mt-1">📍 Destination Address: {order.sessionIdentity?.address || 'No location parameters mapped'}</p>
                </div>
                
                <div className="text-left md:text-right flex flex-col items-start md:items-end gap-1.5">
                  <span className="text-[10px] font-black text-gray-400 uppercase">Current Order Status Protocol</span>
                  <span className={`text-xs font-black uppercase px-3 py-1 rounded-md tracking-widest ${
                    order.status === 'Confirmed' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                    order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                    order.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                    'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}>
                    {order.status || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Product Internal Sub-Array Items Table Container */}
              <div className="bg-slate-50/60 rounded-xl p-4 border border-dashed border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase block mb-2 tracking-wider">Package Inventory Logs</span>
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-slate-800">
                      <div className="flex-1 pr-4">
                        <span className="font-bold tracking-wide">{item.title}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase ml-2">
                          [ Size: <span className="text-[#5d655f]">{item.size}</span> | Qty: {item.quantity} ]
                        </span>
                      </div>
                      <span className="font-mono font-black text-slate-900">৳{Number(item.price) * Number(item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-slate-900">
                  <span className="text-xs font-black uppercase tracking-wider">Gross Aggregate Bill Amount:</span>
                  <span className="text-base font-black tracking-tight">৳{order.totalBill}</span>
                </div>
              </div>

              {/* 🕹️ ACTIONS TERMINAL CONTROLLER CONSOLE */}
              <div className="flex flex-wrap items-center gap-2 pt-2 justify-end">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 block w-full lg:w-auto">Trigger Workflow Action State:</span>
                
                {order.status !== 'Confirmed' && order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                  <button 
                    onClick={() => handleUpdateStatus(order.id, 'Confirmed')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm"
                  >
                    Confirm Order ✅
                  </button>
                )}
                
                {order.status === 'Confirmed' && (
                  <button 
                    onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm"
                  >
                    Mark Recieved / Delivered 📦
                  </button>
                )}

                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                  <button 
                    onClick={() => handleUpdateStatus(order.id, 'Cancelled')}
                    className="px-4 py-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                  >
                    Cancel Order ✕
                  </button>
                )}

                {(order.status === 'Delivered' || order.status === 'Cancelled') && (
                  <span className="text-[10px] font-black text-gray-400 italic">Lifecycle Terminal Locked</span>
                )}
              </div>

            </div>
          ))}

          {/* ─── PAGINATION NAVIGATION BUTTONS BAR ─── */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-6 border-t mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
              >
                ← Previous
              </button>
              
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
              >
                Next →
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
import { useState } from "react";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

export default function CustomerProfileTrack() {
  const [searchPhone, setSearchPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [profileInfo, setProfileInfo] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Rewards Processing Metric configurations
  // const REWARD_CAP_LIMIT = 1000; // Continuous spend ratio limits per point token calculation
  // const REWARDS_GOAL = 5; // Milestone threshold limits tracker system

  const handleFetchProfile = async (e) => {
    e.preventDefault();
    const cleanPhone = searchPhone.trim();
    if (!cleanPhone) return;

    try {
      setLoading(true);
      setHasSearched(true);

      // Query documents layout where phone index exactly matches matching target values
      const q = query(
        collection(db, "cart_sessions"),
        where("sessionIdentity.phone", "==", cleanPhone),
      );

      const snapshot = await getDocs(q);
      const ordersList = [];

      snapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() });
      });

      // Sort descending local array handling timestamp arrays order
      ordersList.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setOrders(ordersList);

      if (ordersList.length > 0) {
        // Extract customer metadata attributes payload reference structures node
        const newestOrder = ordersList[0];
        setProfileInfo({
          name:
            newestOrder.sessionIdentity?.customerName || "Nexmode Elite Member",
          phone: cleanPhone,
        });
      } else {
        setProfileInfo(null);
      }
    } catch (err) {
      console.error("Error processing tracking system calculations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Compute overall accumulated analytics metrics context values matrix fields
  const totalLifetimeSpend = orders.reduce(
    (sum, order) => sum + (Number(order.totalBill) || 0),
    0,
  );

  // Reward algorithm formula logic tokens logic computation modules structure
  // const rawRewardTokens = Math.floor(totalLifetimeSpend / REWARD_CAP_LIMIT);
  // const currentTokensCount = rawRewardTokens % REWARDS_GOAL; // Current level progress tokens calculation
  // const completedRewardMilestones = Math.floor(rawRewardTokens / REWARDS_GOAL);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-sans antialiased min-h-screen">
      {/* Search Bar Panel Setup Row Layout */}
      <div className="bg-slate-50 border border-gray-100 rounded-2xl p-6 shadow-sm mb-8 text-center md:text-left">
        <h2 className="text-sm font-black uppercase text-[#5d655f] tracking-widest mb-1">
          Track Profile
        </h2>
        <h1 className="text-2xl font-black text-slate-900 uppercase mb-4 tracking-wide">
          Nexmode Order Dashboard
        </h1>

        <form
          onSubmit={handleFetchProfile}
          className="flex flex-col sm:flex-row gap-3 max-w-lg"
        >
          <input
            required
            type="tel"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            placeholder="Enter your Phone Number (e.g. 017...)"
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold tracking-wide focus:outline-none focus:ring-1 focus:ring-[#5d655f]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow"
          >
            {loading ? "Searching Profile..." : "Unlock Profile"}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="bg-slate-100 h-32 rounded-2xl" />
          <div className="bg-slate-50 h-64 rounded-2xl" />
        </div>
      ) : hasSearched && orders.length === 0 ? (
        <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-gray-200">
          <span className="text-3xl block mb-2">📦</span>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            No Profiles Found
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            We couldn't track any data locked under this registration number.
          </p>
        </div>
      ) : profileInfo ? (
        <div className="space-y-8">
          {/* ─── DYNAMIC REWARDS GRID INTERACTIVE WIDGET PANEL ─── */}
          <div className="bg-white border border-gray-100 shadow-md rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5d655f]/5 rounded-full translate-x-10 -translate-y-10" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-[9px] font-black uppercase bg-[#5d655f]/10 text-[#5d655f] px-2 py-0.5 rounded tracking-widest">
                  Nexmode Level Status Tracker
                </span>
                <h2 className="text-xl font-black text-slate-800 uppercase mt-1 tracking-wide">
                  {profileInfo.name}
                </h2>
                <p className="text-xs font-semibold text-gray-400">
                  {profileInfo.phone}
                </p>
              </div>
              <div className="text-left md:text-right">
                <span className="text-[10px] font-black uppercase text-gray-400 block">
                  Total Lifetime Shopping Volume
                </span>
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  ৳{totalLifetimeSpend}
                </span>
              </div>
            </div>

            {/* Visual Tokens filling track matrix fields */}
          </div>

          {/* ─── CUSTOMER PAST ORDER HISTORY ARCHIVE PANEL ─── */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">
              Purchase Logs Directory ({orders.length} orders tracked)
            </h3>

            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:border-gray-200 transition-all"
                >
                  {/* Order Card Head Grid Data Row */}
                  <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-dashed border-gray-100">
                    <div>
                      <span className="text-[10px] font-black text-gray-400 block uppercase">
                        Order Reference Node Identity
                      </span>
                      <span className="text-xs font-bold text-slate-700 tracking-wide font-mono select-all">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest ${
                          order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-600"
                            : order.status === "Cancelled"
                              ? "bg-rose-50 text-rose-600"
                              : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Internal items iteration loops inside single purchase package card data */}
                  <div className="py-3 space-y-2">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs"
                      >
                        <div className="flex-1 pr-4">
                          <h5 className="font-bold text-slate-800 line-clamp-1">
                            {item.title}
                          </h5>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wide">
                            Size:{" "}
                            <span className="text-slate-700 font-bold">
                              {item.size}
                            </span>{" "}
                            | Qty: {item.quantity}
                          </span>
                        </div>
                        <span className="font-black text-slate-900 text-right">
                          ৳{Number(item.price) * Number(item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Footer Box pricing layout wrapper */}
                  <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      Settled Gross Statement Bill
                    </span>
                    <span className="text-sm font-black text-slate-900 tracking-tight">
                      ৳{order.totalBill}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

import React, { useState } from 'react';
// Apnar project er firebase config file theke 'db' import korben
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

const RewardManager = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // ১. Phone Number diye Customer Search Kora
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phoneNumber) return;

    setLoading(true);
    setError('');
    setCustomer(null);
    setMessage('');

    try {
      // Document ID jodi phone number hoy, tobe direct fetch kora jay
      const docRef = doc(db, 'loyalty_users', phoneNumber.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCustomer({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError('Ei number e kono customer পাওয়া যায়নি!');
      }
    } catch (err) {
      console.error(err);
      setError('Data fetch korte somossa hoyeche.');
    } finally {
      setLoading(false);
    }
  };

  // ২. Reward Claim / Confirm Kora
  const handleClaimReward = async () => {
    if (!customer) return;

    const availableRewards = customer.totalRewards - (customer.claimedRewards || 0);
    if (availableRewards <= 0) {
      alert("Ei customer er kono available reward nei!");
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, 'customers', customer.id);
      
      // Firebase increment use kore claimed count ১ বাড়িয়ে দেওয়া
      await updateDoc(docRef, {
        claimedRewards: increment(1)
      });

      // Local state update jeno instantly screen-e change dekha jay
      setCustomer((prev) => ({
        ...prev,
        claimedRewards: (prev.claimedRewards || 0) + 1
      }));

      setMessage('Reward successfully claimed and recorded!');
    } catch (err) {
      console.error(err);
      alert('Reward claim update tracking fail hoyeche.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reward Panel</h2>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Search Customer Number</label>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="e.g., 017XXXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-black text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {message && <p className="text-green-600 text-sm font-semibold mb-4">{message}</p>}

      {/* Customer Reward Display Card */}
      {customer && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <h3 className="font-bold text-lg text-gray-800 mb-3">{customer.name || 'Walk-in Customer'}</h3>
          <p className="text-sm text-gray-500 mb-4">Phone: {customer.id}</p>

          {/* Stats Matrix Grid */}
          <div className="grid grid-cols-3 gap-2 mb-6 text-center">
            <div className="bg-white p-2 rounded border">
              <span className="block text-[10px] uppercase font-bold text-gray-400">Total</span>
              <span className="text-lg font-extrabold text-blue-600">{customer.totalRewards || 0}</span>
            </div>
            <div className="bg-white p-2 rounded border">
              <span className="block text-[10px] uppercase font-bold text-gray-400">Claimed</span>
              <span className="text-lg font-extrabold text-green-600">{customer.claimedRewards || 0}</span>
            </div>
            <div className="bg-white p-2 rounded border">
              <span className="block text-[10px] uppercase font-bold text-gray-400">Available</span>
              <span className="text-lg font-extrabold text-red-500">
                {(customer.totalRewards || 0) - (customer.claimedRewards || 0)}
              </span>
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={handleClaimReward}
            disabled={loading || (customer.totalRewards - (customer.claimedRewards || 0) <= 0)}
            className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 text-white disabled:bg-gray-200 disabled:text-gray-400 bg-black hover:bg-gray-800"
          >
            {(customer.totalRewards - (customer.claimedRewards || 0) <= 0) ? 'No Rewards to Claim' : 'Confirm & Claim 1 Reward'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RewardManager;
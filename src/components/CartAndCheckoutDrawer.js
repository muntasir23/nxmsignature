import React, { useState } from 'react';

import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useCart } from '../context/Cartcontext';
import { db } from '../firebase/firebase.config';

export default function CartAndCheckoutDrawer() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  
  // Checkout Processing States
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckoutByNumber = async (e) => {
    e.preventDefault();
    const cleanPhone = customerPhone.trim();
    if (!cleanPhone || cartItems.length === 0) return;

    try {
      setIsSubmitting(true);
      const sessionDocId = `${cleanPhone}_${Date.now()}`;
      const sessionRef = doc(db, "cart_sessions", sessionDocId);

      // 🔥 Exact numeric system schema conversion updates
      const payload = {
        sessionIdentity: {
          phone: cleanPhone,
          customerName: customerName.trim(),
          address: deliveryAddress.trim()
        },
        items: cartItems.map(item => ({
          id: item.id,
          title: item.title,
          price: Number(item.price), 
          quantity: Number(item.quantity),
          size: item.size,
          category: item.category || 'Apparel'
        })),
        totalBill: Number(cartTotal), 
        paymentMethod: 'Cash On Delivery',
        status: 'Pending',
        createdAt: serverTimestamp()
      };

      await setDoc(sessionRef, payload);
      alert(`🎉 Order successfully locked to number: ${cleanPhone}`);
      
      clearCart();
      setCustomerName('');
      setCustomerPhone('');
      setDeliveryAddress('');
      setShowCheckout(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Firebase submit error:", error);
      alert("Database context setup validation error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Badge Counter */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-24 right-4 bg-slate-900 text-white p-3 rounded-full shadow-2xl z-40 flex items-center space-x-2 transition-transform active:scale-95"
      >
        <span>🛒</span>
        <span className="text-xs font-black bg-[#ebe4d6] text-slate-900 px-2 py-0.5 rounded-md">
          {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        </span>
      </button>

      {/* Cart Drawer Frame Layout */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end font-sans antialiased">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between animate-slide-in">
            
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Your Bag</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 font-bold text-lg hover:text-black">✕</button>
            </div>

            {/* Loop Segment Items Row Grid */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cart is empty.</div>
              ) : (
                cartItems.map(item => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 p-3 bg-slate-50 border rounded-xl items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-slate-800 tracking-wide line-clamp-1">{item.title}</h4>
                      
                      <span className="text-[10px] bg-[#5d655f]/10 text-[#5d655f] font-black px-1.5 py-0.5 rounded inline-block mt-0.5 uppercase">
                        Size: {item.size}
                      </span>
                      
                      <p className="text-xs font-black text-slate-900 mt-1">৳{item.price}</p>
                      
                      {/* Fixed Quantity Switches Component */}
                      <div className="flex items-center space-x-2 mt-2">
                        <button type="button" onClick={() => updateQuantity(item.id, item.size, -1)} className="px-2 py-0.5 bg-white border rounded text-xs font-bold hover:bg-gray-100">-</button>
                        <span className="text-xs font-bold text-slate-800 w-4 text-center">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.size, 1)} className="px-2 py-0.5 bg-white border rounded text-xs font-bold hover:bg-gray-100">+</button>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.id, item.size)} className="text-xs text-red-500 font-bold px-2 hover:underline">Remove</button>
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-sm font-black text-slate-900 uppercase tracking-wide">
                <span>Subtotal:</span>
                <span>৳{cartTotal}</span>
              </div>
              <button disabled={cartItems.length === 0} onClick={() => setShowCheckout(true)} className="w-full py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow">
                Proceed To Checkout
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Checkout Window Modal Sheet */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 font-sans antialiased">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Shipping Information</h3>
              <button onClick={() => setShowCheckout(false)} className="text-gray-400 font-bold hover:text-black">✕</button>
            </div>
            <form onSubmit={handleCheckoutByNumber} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">Your Name</label>
                <input required type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-xs font-bold" placeholder="e.g. Ibrahim Ahmed" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">Phone Number</label>
                <input required type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-xs font-bold" placeholder="e.g. 01700000000" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">Delivery Address</label>
                <textarea required rows="3" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-xs font-bold" placeholder="Full Details Address Location..." />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-gray-900 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow">
                {isSubmitting ? 'Saving Session...' : 'Confirm Order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

export function NewDropsGrid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotDrops = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(4));
        const querySnapshot = await getDocs(q);
        const list = [];
        querySnapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
        setItems(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotDrops();
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 font-sans antialiased">
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-[#5d655f] uppercase block mb-1">Freshly Deployed</span>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase">New Drops</h3>
        </div>
        <a href="/shop" className="text-xs font-bold uppercase underline tracking-wider hover:text-[#5d655f]">View Catalog</a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(product => (
          <div key={product.id} className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative aspect-[3/4] overflow-hidden bg-slate-50">
              <img src={product.images?.[0]} alt={product.title} className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500" />
              <span className="absolute top-2 left-2 bg-[#5d655f] text-white text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded">New Drop</span>
            </div>
            <div className="p-3">
              <h4 className="text-xs font-bold text-gray-800 tracking-wide line-clamp-1 mb-2">{product.title}</h4>
              <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-100">
                <span className="text-xs font-black text-slate-900">৳{product.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
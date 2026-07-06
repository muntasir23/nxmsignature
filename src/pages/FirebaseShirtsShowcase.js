import React, { useState, useEffect } from 'react'; 
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

export default function FirebaseShirtsShowcase() {
  const [shirtsList, setShirtsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  useEffect(() => {
    const fetchShirtsFromFirebase = async () => {
      try {
        setLoading(true);
        const productsCollectionRef = collection(db, "products");
        
        // শার্টের ক্যাটাগরিগুলোর লিস্ট
        const shirtCategories = [
          "full-sleeve-shirt", 
          "half-sleeve-shirt", 
          "remi-cotton-shirt", 
          "q-ban-shirt"
        ];

        // 🚨 এখান থেকে orderBy কেটে দিয়েছি যাতে কোনো Index এর ঝামেলা না থাকে
        const q = query(
          productsCollectionRef, 
          where("category", "in", shirtCategories)
        );
        
        const querySnapshot = await getDocs(q);
        
        const fetchedItems = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() });
        });

        // 🚨 ডেটা আসার পর ফ্রন্টএন্ডে createdAt অনুযায়ী সর্ট করে নিচ্ছি (নতুন প্রোডাক্ট আগে দেখাবে)
        fetchedItems.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        setShirtsList(fetchedItems);
      } catch (error) {
        console.error("Firestore Error:", error);
        alert("Data load hote somossa hoyeche! Console check korun.");
      } finally {
        setLoading(false);
      }
    };

    fetchShirtsFromFirebase();
  }, []);

  // Pagination Math
  const totalItems = shirtsList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentShirts = shirtsList.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-xs font-semibold text-gray-400 uppercase tracking-widest">
        Loading Shirts Collection...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans antialiased">
      <div className="border-b border-gray-100 pb-5 mb-8">
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wide">Nexmode Shirts Catalog</h2>
        <p className="text-xs text-gray-400 mt-1">Total Shirts Available: {totalItems}</p>
      </div>

      {currentShirts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentShirts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden">
                <img
                  src={product.images && product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-slate-900 text-white text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded shadow">
                  {product.category?.replace(/-/g, ' ')}
                </span>
              </div>

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
          No shirts found in your database. Please check category names.
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-12">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-slate-50 disabled:opacity-40 transition-all"
          >
            ←
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-9 h-9 text-xs font-bold rounded-xl border transition-all ${
                currentPage === index + 1
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-slate-50'
              }`}
            >
              {index + 1}
            </button>
          ))}
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
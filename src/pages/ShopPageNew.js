import React, { useState, useEffect } from "react";

import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useCart } from "../context/Cartcontext";
import { db } from "../firebase/firebase.config";

export default function ShopPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("default"); // 🔥 Active configuration element
  const [priceRange, setPriceRange] = useState(3000);
  const [selectedSizes, setSelectedSizes] = useState({});

  const categories = [
    { label: "All Collections", value: "All" },
    { label: "Full Sleeve Shirt", value: "full-sleeve-shirt" },
    { label: "Half Sleeve Shirt", value: "half-sleeve-shirt" },
    { label: "Remi Cotton Shirt", value: "remi-cotton-shirt" },
    { label: "Q Ban Shirt", value: "q-ban-shirt" },
    { label: "Formal Trouser", value: "formal-trouser" },
    { label: "Cotton Pant", value: "cotton-pant" },
    { label: "Trouser", value: "trouser" },
    { label: "T-Shirt", value: "t-shirt" },
    { label: "Polo", value: "polo" },
  ];

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const q = query(
          collection(db, "products"),
          orderBy("createdAt", "desc"),
        );
        const querySnapshot = await getDocs(q);
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setProducts(list);
        setFilteredProducts(list);

        const initialSizes = {};
        querySnapshot.forEach((doc) => {
          initialSizes[doc.id] = "M";
        });
        setSelectedSizes(initialSizes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    let updatedList = [...products];
    if (selectedCategory !== "All") {
      updatedList = updatedList.filter(
        (item) =>
          item.category?.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }
    updatedList = updatedList.filter(
      (item) => Number(item.price) <= priceRange,
    );

    // Sort logic trigger processing
    if (selectedSort === "lowToHigh")
      updatedList.sort((a, b) => Number(a.price) - Number(b.price));
    else if (selectedSort === "highToLow")
      updatedList.sort((a, b) => Number(b.price) - Number(a.price));

    setFilteredProducts(updatedList);
  }, [selectedCategory, selectedSort, priceRange, products]);

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans antialiased mt-16">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Frame Container */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-8 bg-slate-50/50 p-5 rounded-2xl border h-fit">
          {/* Categories Option Menu Block */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-900 mb-4 pb-2 border-b">
              Categories
            </h3>
            <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`whitespace-nowrap text-left px-3 py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${
                    selectedCategory === cat.value
                      ? "bg-[#5d655f] text-white shadow-sm"
                      : "text-gray-600 bg-white lg:bg-transparent border shadow-sm lg:shadow-none"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 🔥 FIXED OPTION: Price Sorting Element (Ekhane setSelectedSort assign ebong call complete holo) */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-900 mb-3">
              Sort By Price
            </h3>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full px-3 py-2 bg-white border rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#5d655f]"
            >
              <option value="default">Default (Newest First)</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>

          {/* Range Slider Track Interface */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-black uppercase text-slate-900">
                Max Price
              </h3>
              <span className="text-xs font-black text-[#5d655f]">
                ৳{priceRange}
              </span>
            </div>
            <input
              type="range"
              min="300"
              max="5000"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#5d655f] bg-gray-200 h-1 rounded"
            />
          </div>
        </div>

        {/* Product Layout Grid Box Column */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-50 aspect-[3/4] rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-50">
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-4 border-t flex flex-col justify-between flex-grow">
                    <div>
                      <span className="text-[9px] font-black text-gray-400 block mb-1 uppercase">
                        {categories.find((c) => c.value === product.category)
                          ?.label || product.category}
                      </span>
                      <h2 className="text-xs font-bold text-slate-800 line-clamp-1 mb-2">
                        {product.title}
                      </h2>

                      {/* Size Matrix Row Component Selection */}
                      <div className="my-2.5">
                        <div className="flex gap-1">
                          {sizeOptions.map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => handleSizeChange(product.id, sz)}
                              className={`w-7 h-7 rounded-md text-[10px] font-black transition-all ${
                                selectedSizes[product.id] === sz
                                  ? "bg-[#5d655f] text-white"
                                  : "bg-slate-50 border text-gray-600"
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t border-dashed">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black text-slate-900">
                          ৳{product.price}
                        </span>
                        <span className="text-[10px] font-black text-[#5d655f]">
                          Size: {selectedSizes[product.id]}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          addToCart(product, selectedSizes[product.id])
                        }
                        className="w-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl transition-all"
                      >
                        Add To Cart 🛒
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";

import { db } from "../firebase/firebase.config";

import ProductCard from "../components/ProductCard";

const Products = () => {
  // 🔥 STATES
  const [allProducts, setAllProducts] = useState([]);

  const [products, setProducts] = useState([]);

  const [lastVisible, setLastVisible] = useState(null);

  const [loading, setLoading] = useState(false);

  const [hasMore, setHasMore] = useState(true);

  const [category, setCategory] = useState("all");

  // 🔥 FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "products"),
        orderBy("createdAt", "desc"),
        limit(8),
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ✅ SAVE ALL PRODUCTS
      setAllProducts(data);

      // ✅ SHOW PRODUCTS
      setProducts(data);

      // ✅ LAST DOC
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);

      // ✅ CHECK MORE
      setHasMore(snapshot.docs.length === 8);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FIRST LOAD
  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔥 FILTER
  useEffect(() => {
    if (category === "all") {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(
        (item) =>
          item.category?.toLowerCase().trim() === category.toLowerCase().trim(),
      );

      setProducts(filtered);
    }
  }, [category, allProducts]);

  // 🔥 LOAD MORE
  const handleLoadMore = async () => {
    try {
      if (!lastVisible) return;

      const q = query(
        collection(db, "products"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(8),
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ✅ APPEND PRODUCTS
      setAllProducts((prev) => [...prev, ...data]);

      // ✅ UPDATE LAST DOC
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);

      // ✅ CHECK MORE
      if (snapshot.docs.length < 8) {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));

      // ✅ REMOVE FROM UI
      const updatedProducts = allProducts.filter((item) => item.id !== id);

      setAllProducts(updatedProducts);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-5 md:p-10">
      {/* 🔥 TOP */}
      <div className="flex md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center justify-center gap-2">
        <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping"> </span>
        <h1 className="md:text-2xl text-xl font-bold uppercase text-gray-800">
          Products
        </h1>
        </div>

        {/* 🔥 FILTER */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 rounded border text-black"
        >
          <option value="all">All Products</option>

          <option value="full-sleeve-shirt">Full Sleeve Shirt</option>

          <option value="half-sleeve-shirt">Half Sleeve Shirt</option>

          <option value="remi-cotton-shirt">Remi Cotton Shirt</option>

          <option value="q-ban-shirt">Q Ban Shirt</option>

          <option value="formal-trouser">Formal Trouser</option>

          <option value="cotton-pant">Cotton Pant</option>

          <option value="trouser">Trouser</option>

          <option value="t-shirt">T-Shirt</option>

          <option value="polo">Polo</option>
        </select>
      </div>

      {/* 🔥 LOADING */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          {/* 🔥 PRODUCTS */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                handleDelete={handleDelete}
              />
            ))}
          </div>

          {/* 🔥 EMPTY */}
          {products.length === 0 && (
            <div className="text-center mt-10">No Products Found</div>
          )}

          {/* 🔥 LOAD MORE */}
          {hasMore && allProducts.length > 0 && (
            <div className="text-center mt-10">
              <button
                onClick={handleLoadMore}
                className="bg-blue-500 px-6 py-3 rounded text-white"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;

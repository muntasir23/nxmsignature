import { useEffect, useMemo, useState } from "react";

import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";

import { TiDelete } from "react-icons/ti";

import { jsPDF } from "jspdf";

import html2canvas from "html2canvas";

import toast from "react-hot-toast";

import { db } from "../firebase/firebase.config";

const InvoiceCreate = () => {
  // 🔥 STATES
  const [allProducts, setAllProducts] = useState([]);

  const [products, setProducts] = useState([]);

  const [selectedProducts, setSelectedProducts] = useState([]);

  const [customerName, setCustomerName] = useState("");

  const [number, setNumber] = useState("");

  // const [iprice, setIprice] = useState(0);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("all");

  const [lastVisible, setLastVisible] = useState(null);

  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);

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

      setAllProducts(data);

      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);

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

  // 🔥 FILTER + SEARCH
  useEffect(() => {
    let filtered = [...allProducts];

    // CATEGORY
    if (category !== "all") {
      filtered = filtered.filter(
        (item) =>
          item.category?.toLowerCase().trim() === category.toLowerCase().trim(),
      );
    }

    // SEARCH
    if (search) {
      filtered = filtered.filter((item) =>
        item.title?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    setProducts(filtered);
  }, [allProducts, category, search]);

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

      setAllProducts((prev) => [...prev, ...data]);

      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);

      if (snapshot.docs.length < 8) {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 🔥 ADD PRODUCT
  const handleAddProduct = (product) => {
    const exist = selectedProducts.find((item) => item.id === product.id);

    if (exist) {
      toast.error("Already Added");
      return;
    }

    const newItem = {
      ...product,
      qty: 1,
      code: "00-" + product.id.slice(0, 4),
    };

    setSelectedProducts((prev) => [...prev, newItem]);
  };

  // 🔥 QTY
  const handleQtyChange = (id, qty) => {
    const updated = selectedProducts.map((item) =>
      item.id === id
        ? {
            ...item,
            qty: Number(qty),
          }
        : item,
    );

    setSelectedProducts(updated);
  };

  //price

  const handlePriceChange = (id, iprice) => {
    const updated = selectedProducts.map((item) =>
      item.id === id
        ? {
            ...item,
            iprice: Number(iprice),
          }
        : item,
    );
    setSelectedProducts(updated);
  };

  // 🔥 REMOVE
  const handleRemove = (id) => {
    const filtered = selectedProducts.filter((item) => item.id !== id);

    setSelectedProducts(filtered);
  };

  // 🔥 TOTAL
  const total = useMemo(() => {
    return selectedProducts.reduce(
      (acc, item) => acc + item.iprice * item.qty,
      0,
    );
  }, [selectedProducts]);

  // 🔥 SAVE INVOICE
  const handleSaveInvoice = async () => {
    try {
      await addDoc(collection(db, "invoices"), {
        customerName,
        number,
        products: selectedProducts,
        total,
        createdAt: Date.now(),
      });

      alert("Invoice Saved");
    } catch (error) {
      console.log(error);
    }
  };

  // 🔥 PDF
  const handleDownloadPDF = async () => {
    const element = document.getElementById("invoice");

    const canvas = await html2canvas(element);

    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();

    const imgWidth = 190;

    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(data, "PNG", 10, 10, imgWidth, imgHeight);

    pdf.save("invoice.pdf");
  };

  return (
    <div className="p-2 md:p-10 grid lg:grid-cols-2 gap-10">
      <div>
        <div
          id="invoice"
          className="bg-white text-black rounded-2xl p-3 shadow-xl"
        >
          {/* TOP */}
          <div className="flex justify-between items-center border-b pb-4 mb-5">
            <div>
              <h1 className="text-3xl font-bold">INVOICE</h1>
              <h1 className="text-xl font-semibold mb-5 text-[#C05A3E]">NEXMODE</h1>

              <p>Customer: {customerName}</p>
              <p>Number: {number}</p>
            </div>

            <div>
              <p>Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left">Code</th>

                  <th className="py-3 text-left">Product</th>

                  <th className="py-3 text-left">Qty</th>

                  <th className="py-3 text-left">Price</th>

                  <th className="py-3 text-left">Total</th>

                  <th className="py-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {selectedProducts.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-4">{item.code}</td>

                    <td>{item.title}</td>

                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) =>
                          handleQtyChange(item.id, e.target.value)
                        }
                        className="w-16 border p-1 rounded"
                      />
                    </td>

                    {/* <td>৳ {item.price}</td> */}
                    <td>
                      <input
                        type="number"
                        value={item.iprice}
                        onChange={(e) =>
                          handlePriceChange(item.id, e.target.value)
                        }
                        className="w-16 border p-1 rounded"
                      />
                    </td>
                    <td>{item.iprice * item.qty}</td>

                    <td>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        <TiDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTAL */}
          <div className="flex justify-end mt-8">
            <h2 className="text-2xl font-bold">Total: {total}</h2>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6 flex-wrap">
          <button
            onClick={handleSaveInvoice}
            className="bg-[#C05A3E] text-white px-6 py-3 rounded"
          >
            Save Invoice
          </button>

          <button
            onClick={handleDownloadPDF}
            className="bg-[#613635] text-[#ffffff] px-6 py-3 rounded"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* 🔥 Left */}
      <div>
        <h1 className="text-3xl font-bold mb-5">Create Invoice</h1>

        {/* CUSTOMER */}
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full p-3 border rounded mb-5 text-black"
        />

        <input
          type="text"
          placeholder="Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full p-3 border rounded mb-5 text-black"
        />

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search Product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded mb-4 text-black"
        />

        {/* FILTER */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border rounded mb-5 text-black"
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

        {/* PRODUCTS */}
        <div className="grid gap-4 max-h-[600px] overflow-y-auto">
          {loading ? (
            <p>Loading...</p>
          ) : (
            products.map((item) => (
              <div
                key={item.id}
                className="border rounded-xl p-4 flex items-center gap-4"
              >
                <img
                  src={item?.images?.[0]}
                  alt=""
                  className="w-20 h-20 rounded object-cover"
                />

                <div className="flex-1">
                  <h2 className="font-semibold">{item.title}</h2>

                  <p>BDT {item.price}</p>
                  <p className="text-sm text-gray-500">
                    Code:
                    {"00-" + item.id.slice(0, 4)}
                  </p>
                </div>

                <button
                  onClick={() => handleAddProduct(item)}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
            ))
          )}
        </div>

        {/* LOAD MORE */}
        {hasMore && (
          <div className="mt-5">
            <button
              onClick={handleLoadMore}
              className="bg-blue-500 text-white px-6 py-3 rounded"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceCreate;

import { useEffect, useState } from "react";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { Link } from "react-router-dom";

import {
  Pencil,
  Trash2,
} from "lucide-react";

import { db } from "../firebase/firebase.config";

const InvoiceList = () => {

  const [invoices, setInvoices] =
    useState([]);

  const [search, setSearch] =
    useState("");

  // FETCH INVOICES
  useEffect(() => {

    const fetchInvoices = async () => {

      try {

        const q = query(
          collection(db, "invoices"),
          orderBy("createdAt", "desc")
        );

        const snapshot =
          await getDocs(q);

        const data =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setInvoices(data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchInvoices();

  }, []);

  // UPDATE STATUS
  const handleStatusChange =
    async (id, status) => {

      try {

        await updateDoc(
          doc(db, "invoices", id),
          {
            status,
          }
        );

        setInvoices((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status,
                }
              : item
          )
        );

      } catch (error) {
        console.log(error);
      }
    };

  // DELETE
  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this invoice?"
        );

      if (!confirmDelete) return;

      try {

        await deleteDoc(
          doc(db, "invoices", id)
        );

        setInvoices((prev) =>
          prev.filter(
            (item) => item.id !== id
          )
        );

      } catch (error) {
        console.log(error);
      }
    };

  // SEARCH
  const filteredInvoices =
    invoices.filter((invoice) =>
      invoice.customerName
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div className="p-5 md:p-10">

      {/* TOP */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">

        <h1 className="text-3xl font-bold">
          Invoice List
        </h1>

        <input
          type="text"
          placeholder="Search Customer..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border p-3 rounded w-full md:w-80 text-black"
        />

      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">

        <table className="w-full">

          <thead>

            <tr className="bg-gray-100">

              <th className="p-4 text-left">
                Invoice No
              </th>

              <th className="p-4 text-left">
                Customer
              </th>

              <th className="p-4 text-left">
                Products
              </th>

              <th className="p-4 text-left">
                Total
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredInvoices.map(
              (
                invoice,
                index
              ) => (

                <tr
                  key={invoice.id}
                  className="border-b"
                >

                  {/* Invoice Number */}
                  <td className="p-4 font-medium">

                    INV-
                    {String(
                      filteredInvoices.length -
                        index
                    ).padStart(
                      4,
                      "0"
                    )}

                  </td>

                  {/* Customer */}
                  <td className="p-4">
                    {
                      invoice.customerName
                    }
                  </td>

                  {/* Product Count */}
                  <td className="p-4">
                    {
                      invoice.products
                        ?.length
                    }
                  </td>

                  {/* Total */}
                  <td className="p-4">
                    ৳ {invoice.total}
                  </td>

                  {/* Date */}
                  <td className="p-4">

                    {new Date(
                      invoice.createdAt
                    ).toLocaleDateString()}

                  </td>

                  {/* STATUS */}
                  <td className="p-4">

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          handleStatusChange(
                            invoice.id,
                            "pending"
                          )
                        }
                        className={`w-5 h-5 rounded-full border-2 ${
                          invoice.status ===
                          "pending"
                            ? "bg-yellow-500 border-yellow-500"
                            : "border-gray-400"
                        }`}
                      />

                      <button
                        onClick={() =>
                          handleStatusChange(
                            invoice.id,
                            "delivered"
                          )
                        }
                        className={`w-5 h-5 rounded-full border-2 ${
                          invoice.status ===
                          "delivered"
                            ? "bg-green-500 border-green-500"
                            : "border-gray-400"
                        }`}
                      />

                      <button
                        onClick={() =>
                          handleStatusChange(
                            invoice.id,
                            "due"
                          )
                        }
                        className={`w-5 h-5 rounded-full border-2 ${
                          invoice.status ===
                          "due"
                            ? "bg-red-500 border-red-500"
                            : "border-gray-400"
                        }`}
                      />

                    </div>

                  </td>

                  {/* ACTION */}
                  <td className="p-4">

                    <div className="flex gap-2">

                      <Link
                        to={`/editinvoice/${invoice.id}`}
                        className="bg-blue-500 text-white p-2 rounded"
                      >
                        <Pencil size={16} />
                      </Link>

                      <Link
                        to={`/invoice/${invoice.id}`}
                        className="bg-blue-500 text-white p-2 rounded"
                      >
                        Click
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(
                            invoice.id
                          )
                        }
                        className="bg-red-500 text-white p-2 rounded"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default InvoiceList;
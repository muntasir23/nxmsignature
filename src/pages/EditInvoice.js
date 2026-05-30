import { useEffect, useMemo, useState } from "react";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import { db } from "../firebase/firebase.config";

const EditInvoice = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [customerName, setCustomerName] =
    useState("");

  const [status, setStatus] =
    useState("pending");

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // FETCH INVOICE
  useEffect(() => {

    const fetchInvoice = async () => {

      try {

        const docRef = doc(
          db,
          "invoices",
          id
        );

        const snap =
          await getDoc(docRef);

        if (snap.exists()) {

          const data =
            snap.data();

          setCustomerName(
            data.customerName || ""
          );

          setStatus(
            data.status || "pending"
          );

          setProducts(
            data.products || []
          );
        }

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();

  }, [id]);

  // QTY UPDATE
  const handleQtyChange = (
    productId,
    qty
  ) => {

    const updated =
      products.map((item) =>
        item.id === productId
          ? {
              ...item,
              qty: Number(qty),
            }
          : item
      );

    setProducts(updated);
  };

  // REMOVE PRODUCT
  const handleRemove = (
    productId
  ) => {

    const filtered =
      products.filter(
        (item) =>
          item.id !== productId
      );

    setProducts(filtered);
  };

  // TOTAL
  const total = useMemo(() => {

    return products.reduce(
      (acc, item) =>
        acc +
        Number(item.iprice) *
          Number(item.qty),
      0
    );

  }, [products]);

  // UPDATE INVOICE
  const handleUpdate =
    async () => {

      try {

        await updateDoc(
          doc(
            db,
            "invoices",
            id
          ),
          {
            customerName,
            status,
            products,
            total,
          }
        );

         alert(
          "Invoice Updated"
        );

        navigate("/invoicelist");

      } catch (error) {
        console.log(error);

        toast.error(
          "Update Failed"
        );
      }
    };

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-5">

      <h1 className="text-3xl font-bold mb-8">
        Edit Invoice
      </h1>

      {/* CUSTOMER */}

      <div className="mb-5">

        <label className="block mb-2">
          Customer Name
        </label>

        <input
          type="text"
          value={customerName}
          onChange={(e) =>
            setCustomerName(
              e.target.value
            )
          }
          className="w-full border p-3 rounded"
        />

      </div>

      {/* STATUS */}

      <div className="mb-8">

        <label className="block mb-2">
          Status
        </label>

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
          className="border p-3 rounded w-full"
        >

          <option value="pending">
            Pending
          </option>

          <option value="delivered">
            Delivered
          </option>

          <option value="due">
            Due
          </option>

        </select>

      </div>

      {/* PRODUCTS */}

      <div className="overflow-x-auto bg-white rounded-xl shadow">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="p-4 text-left">
                Product
              </th>

              <th className="p-4 text-left">
                Price
              </th>

              <th className="p-4 text-left">
                Qty
              </th>

              <th className="p-4 text-left">
                Total
              </th>

              <th className="p-4 text-left">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {products.map(
              (item) => (

                <tr
                  key={item.id}
                  className="border-b"
                >

                  <td className="p-4">
                    {item.title}
                  </td>

                  <td className="p-4">
                    ৳ {item.iprice}
                  </td>

                  <td>

                  </td>

                  <td className="p-4">

                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) =>
                        handleQtyChange(
                          item.id,
                          e.target
                            .value
                        )
                      }
                      className="border p-2 rounded w-20"
                    />

                  </td>

                  <td className="p-4">

                    
                    {Number(
                      item.iprice
                    ) *
                      Number(
                        item.qty
                      )}

                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        handleRemove(
                          item.id
                        )
                      }
                      className="bg-red-500 text-white px-3 py-2 rounded"
                    >
                      Remove
                    </button>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {/* TOTAL */}

      <div className="mt-8 text-right">

        <h2 className="text-2xl font-bold">
          Total: BDT {total}
        </h2>

      </div>

      {/* UPDATE */}

      <div className="mt-8">

        <button
          onClick={handleUpdate}
          className="bg-[#C05A3E] text-white px-8 py-3 rounded"
        >
          Update Invoice
        </button>

      </div>

    </div>
  );
};

export default EditInvoice;
import { useEffect, useState } from "react";

import { doc, getDoc } from "firebase/firestore";

import { useParams } from "react-router-dom";

import { db } from "../firebase/firebase.config";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [mainImage, setMainImage] = useState("");

  const [loading, setLoading] = useState(true);

  // 🔥 FETCH SINGLE PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);

        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = {
            id: snapshot.id,
            ...snapshot.data(),
          };

          setProduct(data);

          // ✅ DEFAULT MAIN IMAGE
          setMainImage(data?.images?.[0]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔥 LOADING
  if (loading) {
    return <div className="text-center py-20 text-xl">Loading...</div>;
  }

  // 🔥 NO PRODUCT
  if (!product) {
    return <div className="text-center py-20 text-xl">Product Not Found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-5 md:p-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* 🔥 LEFT SIDE */}
        <div>
          {/* MAIN IMAGE */}
          <div className="border rounded-2xl overflow-hidden">
            <img
              src={mainImage}
              alt={product?.title}
              className="w-full object-cover"
            />
          </div>

          {/* THUMBNAILS */}
          <div className="flex gap-3 mt-5 flex-wrap">
            {product?.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt=""
                onClick={() => setMainImage(img)}
                className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 transition
                      
                      ${mainImage === img ? "border-black" : "border-gray-200"}
                    `}
              />
            ))}
          </div>
        </div>

        {/* 🔥 RIGHT SIDE */}
        <div className="space-y-5">
          {/* TITLE */}
          <h1 className="text-4xl font-bold">{product?.title}</h1>

          {/* PRICE */}
          <p className="text-3xl font-semibold text-green-600">
            BDT {product?.price}
          </p>

          {/* CATEGORY */}
          <p className="text-gray-500 capitalize text-lg">
            {product?.category?.replaceAll("-", " ")}
          </p>

          {/* DESCRIPTION */}
          <div className="pt-5 border-t">
            <h2 className="text-2xl font-semibold mb-3">Product Details</h2>

            <p className="text-gray-600 leading-8">
              {product?.description || "No description available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

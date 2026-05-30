import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { useNavigate, useParams } from "react-router-dom";


const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);

  // 🔥 Fetch single product
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "products", id);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();

          console.log("EDIT DATA:", data);

          setTitle(data.title || "");
          setPrice(data.price || "");
          setImages(data.images || []);
        } else {
          alert("Product not found");
        }
      } catch (error) {
        console.log(error);
        alert("Something went wrong");
      }
    };

    fetchData();
    console.log(fetchData())
  }, [id]);

  // 🔥 Update product
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "products", id), {
        title,
        price,
      });

      alert("Updated Successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <form
        onSubmit={handleUpdate}
        className="bg-slate-100 p-5 rounded space-y-5"
      >
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Product Title"
          className="w-full p-3 rounded text-black bg-slate-300"
        />

        {/* Price */}
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full p-3 rounded text-black bg-slate-300"
        />

        {/* 🔥 Images Preview */}
        <div className="flex gap-3 flex-wrap">
          {images?.length > 0 ? (
            images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt=""
                className="w-24 h-24 object-cover rounded"
              />
            ))
          ) : (
            <p className="text-sm text-gray-300">
              No images found
            </p>
          )}
        </div>

        {/* Button */}
        <button className="bg-[#613635] text-[#ffffff] px-5 py-3 rounded">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
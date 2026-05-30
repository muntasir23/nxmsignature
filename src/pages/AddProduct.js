import { useState } from "react";

import { addDoc, collection } from "firebase/firestore";

import { db } from "../firebase/firebase.config";

import FileUpload from "../components/FileUpload";

import { uploadMultipleImages } from "../utils/cloudinary";

const AddProduct = () => {
  const [title, setTitle] = useState("");

  const [price, setPrice] = useState("");

  const [category, setCategory] = useState("");

  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Upload To Cloudinary
      const imageUrls = await uploadMultipleImages(files);

      // Save To Firestore
      await addDoc(collection(db, "products"), {
        title,
        price,
        category,
        images: imageUrls,
        createdAt: Date.now(),
      });

      setTitle("");
      setPrice("");
      setFiles([]);

      alert("Done");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-100 p-5 rounded space-y-5 shadow"
      >
        <input
          type="text"
          placeholder="Product Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded text-black bg-slate-300"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 rounded text-black bg-slate-300"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 rounded text-black border bg-slate-300"
        >
          <option value="">Choose Category</option>

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

        <FileUpload setFiles={setFiles} className="bg-slate-300" />

        <button disabled={loading} className="bg-[#613635] text-[#ffffff] px-5 py-3 rounded">
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

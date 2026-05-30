import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { MdOutlineDeleteSweep } from "react-icons/md";

const ProductCard = ({ item, handleDelete }) => {
  return (
    <div className="bg-slate-200 p-4 rounded shadow ">
      <img
        src={item.images?.[0]}
        alt=""
        className="w-full h-52 object-cover rounded"
      />

      <h2 className="text-xl mt-3 font-semibold text-[#613635] ">{item.title}</h2>

      <p className="mt-1">
        {" "}
        <strong> BDT</strong> {item.price}
      </p>

      <div className="flex gap-3 mt-4">
        <Link
          to={`/edit/${item.id}`}
          className="mr-1 bg-[#613635] p-2 rounded text-white "
        >
          <FaEdit />
        </Link>

        <Link
          to={`/product/${item.id}`}
          className="mr-1 bg-black p-2 rounded text-white"
        >
          <GrView />
        </Link>

        <button
          onClick={() => handleDelete(item.id)}
          className="mr-1 bg-[#C05A3E] p-2 rounded text-white"
        >
          <MdOutlineDeleteSweep />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

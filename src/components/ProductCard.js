import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ item, handleDelete }) => {
  const { currentUser } = useAuth();
  return (
    <Link to={`/product/${item.id}`}>
      <div className="bg-slate-200 p-4 rounded shadow ">
        <div className="h-[100px] md:h-[200px] w-full overflow-hidden">
          <img src={item.images?.[0]} alt="" className="w-full rounded" />
        </div>

        <h2 className="text-sm md:text-xl mt-3 font-semibold text-[#613635] ">
          {item.title}
        </h2>

        <p className="mt-1">
          {" "}
          <strong className="text-xs"> BDT</strong> {item.price}
        </p>

        {currentUser ? (
          <div className="flex gap-3 mt-4">
            <Link
              to={`/edit/${item.id}`}
              className="mr-1 bg-[#613635] p-1 rounded text-white "
            >
              <FaEdit />
            </Link>

            <Link
              to={`/product/${item.id}`}
              className="mr-1 bg-black p-1 rounded text-white"
            >
              <GrView />
            </Link>

            <button
              onClick={() => handleDelete(item.id)}
              className="mr-1 bg-[#C05A3E] p-1 rounded text-white"
            >
              <MdOutlineDeleteSweep />
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </Link>
  );
};

export default ProductCard;

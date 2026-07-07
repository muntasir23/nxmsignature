import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ item, handleDelete }) => {
  const { currentUser } = useAuth();
  return (
    <Link to={`/product/${item.id}`}>
      <div className="bg-gray-50 rounded shadow ">
        <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden">
          {/* <img src={item.images?.[0]} alt="" className="w-full rounded transform hover:scale-110 transition-transform duration-500 ease-out" /> */}
          <img
            src={item.images && item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </div>

        <h2 className="text-sm md:text-md text-gray-800 mt-3 font-bold uppercase p-1">
          {item.title}
        </h2>

        <div className="mt-2 flex items-end justify-between p-1">
          <p>
            <span className="text-gray-400 text-sm">Price</span>
            <p className="text-orange-600 font-bold text-sm">
              BDT {item.price}
            </p>
          </p>
          {currentUser ? (
            <div className="flex items-center justify-center gap-0">
              <Link
                to={`/edit/${item.id}`}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-blue-100"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </Link>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-red-100"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

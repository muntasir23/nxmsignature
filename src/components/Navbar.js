import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { logout } = useAuth();
  const { currentUser } = useAuth();

  const menuItems = [
    { name: "Add Product", url: "/add" },
    { name: "Add Invoice", url: "/invoice" },
    { name: "Invoices", url: "invoicelist" },
    { name: "Add Customers", url: "/adminstation" },
    { name: "Loyalty Records", url: "/admindashboard" },
  ];

  return (
    <nav className="relative bg-white shadow-md w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 1. Left Side: Logo */}
          <Link to="/">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold tracking-wider text-black">
                NEXMODE
              </span>
            </div>
          </Link>

          {/* 2. Middle: Text (Next is Now) */}
          {!currentUser ? (
            <div className="hidden md:flex items-center">
              <span className="text-sm font-medium tracking-widest text-gray-500">
                Next is Now
              </span>
            </div>
          ) : (
            ""
          )}

          {/* 3. Right Side: Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {currentUser ? (
              menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.url}
                  className="relative text-gray-700 hover:text-black font-medium transition-colors duration-300 py-1 group"
                >
                  {item.name}
                  {/* Hover Underline Effect (Choto theke boro hobe) */}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))
            ) : (
              <>
                <Link
                  to="shop"
                  className="relative text-gray-700 hover:text-black font-medium transition-colors duration-300 py-1 group"
                >
                  Shop
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  to="shirts"
                  className="relative text-gray-700 hover:text-black font-medium transition-colors duration-300 py-1 group"
                >
                  Shirts
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  to="polo"
                  className="relative text-gray-700 hover:text-black font-medium transition-colors duration-300 py-1 group"
                >
                  Polo
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  to="pants"
                  className="relative text-gray-700 hover:text-black font-medium transition-colors duration-300 py-1 group"
                >
                  Pants
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </>
            )}
            <Link
              to="/rewards"
              onClick={() => setIsOpen(false)}
              className="relative text-lg font-medium text-gray-800 hover:text-black py-1 w-max group transition-colors duration-300 g"
            >
              Rewards
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {!currentUser ? (
              <Link
                to="/login"
                className="bg-emerald-700 text-emerald-100 p-2 rounded"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={logout}
                className="bg-red-700 text-red-100 p-2 rounded"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(true)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-black focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Drawer (Side Sidebar) --- */}
      {/* Overlay Background */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-40 md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Body */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
            Next is Now
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-black focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Drawer Links */}
        <div className="flex flex-col p-6 space-y-6">
          {currentUser ? (
            menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.url}
                onClick={() => setIsOpen(false)} // link e click korle drawer off hobe
                className="relative text-lg font-medium text-gray-800 hover:text-black py-1 w-max group"
              >
                {item.name}
                {/* Drawer Underline Effect */}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))
          ) : (
            <>
              <Link
                to="shop"
                className="relative text-gray-700 hover:text-black font-medium transition-colors duration-300 py-1 group"
              >
                Shop
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="shirts"
                className="relative text-gray-700 hover:text-black font-medium transition-colors duration-300 py-1 group"
              >
                Shirts
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="polo"
                className="relative text-gray-700 hover:text-black font-medium transition-colors duration-300 py-1 group"
              >
                Polo
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="pants"
                className="relative text-gray-700 hover:text-black font-medium transition-colors duration-300 py-1 group"
              >
                Pants
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </>
          )}
          <Link
            to="/rewards"
            onClick={() => setIsOpen(false)}
            className="relative text-lg font-medium text-gray-800 hover:text-black py-1 w-max group"
          >
            Rewards
          </Link>
          {!currentUser ? (
            <Link
              to="/login"
              className="bg-emerald-700 text-emerald-100 p-2 rounded"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={logout}
              className="bg-red-700 text-red-100 p-2 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from "react";
import { Link } from "react-router-dom";
import nxmlogo from "../assets/NEXMODE.png";
import { IoAddCircleOutline } from "react-icons/io5";
import { PiInvoice } from "react-icons/pi";
import { IoList } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { IoIosLogOut } from "react-icons/io";
import { MdOutlineAccountCircle, MdSpaceDashboard } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import { GrFormView } from "react-icons/gr";

export default function Navbar() {
  const { logout } = useAuth();
  const { currentUser } = useAuth();

  return (
    <div>
      <div className="flex md:justify-between items-center gap-0 flex-col px-3 md:px-8 py-3 bg-slate-50">

        <Link to="/">
          <img alt="logo" src={nxmlogo} className="w-[200px]" />
        </Link>

        <h1 className="font-semibold text-[#613635] invisible  md:visible ">
          Next Is Now
        </h1>

        <div className="flex items-center justify-center">
          {currentUser ? (
            <>
              <Link to="/add" className="md:p-3 text-[#613635] text-[25px] ">
                <IoAddCircleOutline />
              </Link>
              <Link to="/invoice" className="md:p-3 text-[#613635] text-[25px] ">
                <PiInvoice />
              </Link>
              <Link
                to="/invoicelist"
                className="md:p-3 text-[#613635] text-[25px] "
              >
                <IoList />
              </Link>
              <Link
                to="/adminentry"
                className="md:p-3 text-[#613635] text-[25px] "
              >
                <FaUserPlus />
              </Link>
              <Link
                to="/admindashboard"
                className="md:p-3 text-[#613635] text-[25px] "
              >
                <MdSpaceDashboard />
              </Link>
            </>
          ) : (
            ""
          )}
          <Link to="/customerview" className="md:p-3 text-[#613635] text-[25px] ">
            <GrFormView />
          </Link>

          {currentUser ? (
            <button
              onClick={logout}
              className="p-3 text-[#613635] text-[25px] "
            >
              {" "}
              <IoIosLogOut />
            </button>
          ) : (
            <Link to="/login" className="md:p-3 text-[#613635] text-[25px] ">
              <MdOutlineAccountCircle />{" "}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

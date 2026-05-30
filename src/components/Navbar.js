import React from "react";
import { Link } from "react-router-dom";
import nxmlogo from "../assets/NEXMODE.png";
import { IoAddCircleOutline } from "react-icons/io5";
import { PiInvoice } from "react-icons/pi";
import { IoList } from "react-icons/io5";

export default function Navbar() {
  return (
    <div>
      <div className="flex justify-between items-center px-3 md:px-8 py-3 bg-slate-50">
        <Link to='/'>
          <img alt="logo" src={nxmlogo} className="w-[200px]" />
        </Link>
        <h1 className="font-semibold text-[#613635] invisible  md:visible ">Next Is Now</h1>

        <div className="flex items-center justify-center">
          <Link to="/add" className="p-3 text-[#613635] text-[25px] ">
            <IoAddCircleOutline />
          </Link>
          <Link to="/invoice" className="p-3 text-[#613635] text-[25px] ">
           <PiInvoice />
          </Link>
          <Link to="/invoicelist" className="p-3 text-[#613635] text-[25px] ">
           <IoList />
          </Link>
        </div>
      </div>
    </div>
  );
}

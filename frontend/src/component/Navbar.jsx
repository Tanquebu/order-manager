import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      <div className="text-lg font-semibold">Order Manager</div>
      <div className="flex items-center gap-6">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "underline text-white" : "text-gray-300 hover:text-white"
          }
        >
          Ordini
        </NavLink>
        <NavLink
          to="/customers"
          className={({ isActive }) =>
            isActive ? "underline text-white" : "text-gray-300 hover:text-white"
          }
        >
          Clienti
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "underline text-white" : "text-gray-300 hover:text-white"
          }
        >
          Prodotti
        </NavLink>

        <div className="flex items-center gap-4 ml-6">
          {user && <span className="text-sm hidden sm:inline">Ciao, {user.name}</span>}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
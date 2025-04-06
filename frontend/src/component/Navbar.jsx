import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Clienti", path: "/customers" },
    { label: "Prodotti", path: "/products" },
    { label: "Ordini", path: "/orders" },
  ];

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-lg font-semibold text-blue-700">🧾 OrderManager</div>

        <div className="flex space-x-4">
          {navItems.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`text-sm font-medium ${
                location.pathname === path
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">👤 {user?.name}</span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

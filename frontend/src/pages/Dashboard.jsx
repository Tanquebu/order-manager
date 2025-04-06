import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [orderRes, customerRes, productRes] = await Promise.all([
        api.get("/orders"),
        api.get("/customers"),
        api.get("/products"),
      ]);
      setOrders(orderRes.data.slice(-5).reverse());
      setCustomers(customerRes.data.slice(-5).reverse());
      setProducts(productRes.data.slice(-5).reverse());
    } catch (err) {
      console.error("Errore nel caricamento dashboard:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ORDINI */}
        <div className="bg-white shadow rounded p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-lg">Ultimi Ordini</h2>
            <Link to="/orders" className="text-sm text-blue-600 hover:underline">Vedi tutti</Link>
          </div>
          <ul className="text-sm space-y-2">
            {orders.map(order => (
              <li key={order.id} className="border-b pb-1">
                <strong>#{order.id}</strong> – {order.customer?.name || "—"}<br />
                Stato: <span className="font-medium">{order.status}</span><br />
                Totale: {formatPrice(order.products.reduce((acc, p) => acc + p.price * p.pivot.quantity, 0))}
              </li>
            ))}
          </ul>
        </div>

        {/* CLIENTI */}
        <div className="bg-white shadow rounded p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-lg">Ultimi Clienti</h2>
            <Link to="/customers" className="text-sm text-blue-600 hover:underline">Vedi tutti</Link>
          </div>
          <ul className="text-sm space-y-2">
            {customers.map(c => (
              <li key={c.id} className="border-b pb-1">
                <strong>{c.name}</strong><br />
                {c.email}
              </li>
            ))}
          </ul>
        </div>

        {/* PRODOTTI */}
        <div className="bg-white shadow rounded p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-lg">Ultimi Prodotti</h2>
            <Link to="/products" className="text-sm text-blue-600 hover:underline">Vedi tutti</Link>
          </div>
          <ul className="text-sm space-y-2">
            {products.map(p => (
              <li key={p.id} className="border-b pb-1">
                {p.name}<br />
                {formatPrice(p.price)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
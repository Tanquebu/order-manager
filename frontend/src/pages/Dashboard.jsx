import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { formatPrice } from "../utils/format";

const Dashboard = () => {
  const [latestOrders, setLatestOrders] = useState([]);
  const [latestCustomers, setLatestCustomers] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    api.get("/orders/latest").then((res) => setLatestOrders(res.data));
    api.get("/customers/latest").then((res) => setLatestCustomers(res.data));
    api.get("/products/latest").then((res) => setLatestProducts(res.data));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ultimi Ordini */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Ultimi Ordini</h2>
          {latestOrders.map((order) => (
            <div key={order.id} className="border-b py-2 text-sm">
              <div className="font-medium">
                #{order.id} - {order.customer?.name}
              </div>
              <div className="text-xs text-gray-500">
                Totale:{" "}
                {formatPrice(
                  order.products.reduce(
                    (acc, p) => acc + p.price * p.pivot.quantity,
                    0
                  )
                )}{" "}
                · Stato: {order.status}
              </div>
            </div>
          ))}
          {latestOrders.length === 0 && <p className="text-xs text-gray-500">Nessun ordine recente</p>}
        </div>

        {/* Ultimi Clienti */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Ultimi Clienti</h2>
          {latestCustomers.map((c) => (
            <div key={c.id} className="border-b py-2 text-sm">
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-gray-500">{c.email}</div>
            </div>
          ))}
          {latestCustomers.length === 0 && <p className="text-xs text-gray-500">Nessun cliente recente</p>}
        </div>

        {/* Ultimi Prodotti */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Ultimi Prodotti</h2>
          {latestProducts.map((p) => (
            <div key={p.id} className="border-b py-2 text-sm">
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-gray-500">{formatPrice(p.price)}</div>
            </div>
          ))}
          {latestProducts.length === 0 && <p className="text-xs text-gray-500">Nessun prodotto recente</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
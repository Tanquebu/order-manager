import React, { useEffect, useState } from "react";
import api from "../api/axios";
import OrderCard from "../component/OrderCard";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (err) {
      setError("Errore nel recupero degli ordini.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = filteredStatus
    ? orders.filter((order) => order.status === filteredStatus)
    : orders;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Dashboard Ordini</h1>

      <div className="mb-4">
        <label className="mr-2 font-medium">Filtra per stato:</label>
        <select
          className="border p-1"
          value={filteredStatus}
          onChange={(e) => setFilteredStatus(e.target.value)}
        >
          <option value="">Tutti</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {loading && <p>Caricamento ordini...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {filteredOrders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}

      {filteredOrders.length === 0 && !loading && <p>Nessun ordine trovato.</p>}
    </div>
  );
};

export default Dashboard;
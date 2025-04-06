import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { formatPrice } from "../utils/format";
import OrderForm from "../component/OrderForm";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Errore nel caricamento ordini:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Gestione Ordini</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm"
        >
          {showForm ? "Annulla" : "Nuovo Ordine"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 border p-4 rounded bg-gray-50">
          <OrderForm
            onSuccess={() => {
              fetchOrders();
              setShowForm(false);
            }}
          />
        </div>
      )}

      <div className="mb-4">
        <label className="mr-2 text-sm">Filtra per stato:</label>
        <select
          className="border p-1 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tutti</option>
          <option value="pending">In attesa</option>
          <option value="processing">In elaborazione</option>
          <option value="shipped">Spedito</option>
          <option value="delivered">Consegnato</option>
          <option value="canceled">Annullato</option>
          <option value="closed">Chiuso</option>
        </select>
      </div>

      {filteredOrders.length > 0 ? (
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 text-left">#</th>
              <th className="border px-2 py-1 text-left">Cliente</th>
              <th className="border px-2 py-1 text-left">Prodotti</th>
              <th className="border px-2 py-1 text-left">Totale</th>
              <th className="border px-2 py-1 text-left">Stato</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="border px-2 py-1">#{order.id}</td>
                <td className="border px-2 py-1">{order.customer?.name}</td>
                <td className="border px-2 py-1">
                  {order.products.map((p) => (
                    <div key={p.id}>
                      {p.name} × {p.pivot.quantity}
                    </div>
                  ))}
                </td>
                <td className="border px-2 py-1">
                  {formatPrice(
                    order.products.reduce(
                      (acc, p) => acc + p.price * p.pivot.quantity,
                      0
                    )
                  )}
                </td>
                <td className="border px-2 py-1">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nessun ordine trovato.</p>
      )}
    </div>
  );
};

export default OrderList;
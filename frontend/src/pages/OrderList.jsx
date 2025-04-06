import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { formatPrice } from "../utils/format";
import OrderForm from "../component/OrderForm";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
      // Inizializza gli status correnti
      const initialStatus = {};
      res.data.forEach((order) => {
        initialStatus[order.id] = order.status;
      });
      setPendingStatus(initialStatus);
    } catch (err) {
      console.error("Errore nel caricamento ordini:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id) => {
    try {
      const newStatus = pendingStatus[id];
      await api.put(`/orders/${id}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Errore aggiornamento stato ordine:", err);
    }
  };

  const filteredOrders = statusFilter
  ? orders.filter((o) => o.status === statusFilter)
  : orders;

  const cancelChange = (id, originalStatus) => {
    setPendingStatus((prev) => ({ ...prev, [id]: originalStatus }));
  };

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
              <th className="border px-2 py-1 text-left">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const original = order.status;
              const current = pendingStatus[order.id];
              const isDirty = current !== original;

              return (
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
                  <td className="border px-2 py-1">
                    <select
                      className="border p-1 text-sm"
                      value={pendingStatus[order.id]}
                      onChange={(e) =>
                        setPendingStatus((prev) => ({
                          ...prev,
                          [order.id]: e.target.value,
                        }))
                      }
                    >
                      <option value="pending">In attesa</option>
                      <option value="processing">In elaborazione</option>
                      <option value="shipped">Spedito</option>
                      <option value="delivered">Consegnato</option>
                      <option value="canceled">Annullato</option>
                      <option value="closed">Chiuso</option>
                    </select>
                  </td>
                  <td className="border px-2 py-1 space-x-2">
                    {isDirty && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id)}
                          className="text-green-600 text-sm"
                        >
                          Salva
                        </button>
                        <button
                          onClick={() => cancelChange(order.id, original)}
                          className="text-red-500 text-sm"
                        >
                          Annulla
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>Nessun ordine trovato.</p>
      )}
    </div>
  );
};

export default OrderList;
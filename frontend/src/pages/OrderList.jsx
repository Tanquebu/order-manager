import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { formatPrice } from "../utils/format";
import OrderForm from "../component/OrderForm";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState({});
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchOrders = async (page = 1) => {
    try {
      const res = await api.get(`/orders?page=${page}`);
      setOrders(res.data.data);
      setPage(res.data.current_page);
      setLastPage(res.data.last_page);
      const initialStatus = {};
      res.data.data.forEach((order) => {
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
      fetchOrders(page);
    } catch (err) {
      console.error("Errore aggiornamento stato ordine:", err);
    }
  };

  const cancelChange = (id, originalStatus) => {
    setPendingStatus((prev) => ({ ...prev, [id]: originalStatus }));
  };

  const filteredOrders = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  const statusBadge = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      canceled: "bg-red-100 text-red-800",
      closed: "bg-gray-200 text-gray-700",
    };
    return (
      <span className={`px-2 py-1 text-xs rounded ${map[status] || "bg-gray-100"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Ordini</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
        >
          {showForm ? "Annulla" : "+ Nuovo Ordine"}
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

      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm">
        <label>Filtra per stato:</label>
        <select
          className="border p-1 rounded"
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
        <>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border mb-6">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Cliente</th>
                <th className="border px-3 py-2">Prodotti</th>
                <th className="border px-3 py-2">Totale</th>
                <th className="border px-3 py-2">Stato</th>
                <th className="border px-3 py-2">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const original = order.status;
                const current = pendingStatus[order.id];
                const isDirty = current !== original;

                return (
                  <tr key={order.id}>
                    <td className="border px-3 py-2">#{order.id}</td>
                    <td className="border px-3 py-2">{order.customer?.name}</td>
                    <td className="border px-3 py-2">
                      {order.products.map((p) => (
                        <div key={p.id}>
                          {p.name} × {p.pivot.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="border px-3 py-2">
                      {formatPrice(
                        order.products.reduce(
                          (acc, p) => acc + p.price * p.pivot.quantity,
                          0
                        )
                      )}
                    </td>
                    <td className="border px-3 py-2">
                      <div className="flex items-center gap-2">
                        <select
                          className="border text-sm p-1 rounded"
                          value={current}
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
                        {statusBadge(current)}
                      </div>
                    </td>
                    <td className="border px-3 py-2 space-x-2">
                      {isDirty && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id)}
                            className="text-green-600 text-xs hover:underline"
                          >
                            Salva
                          </button>
                          <button
                            onClick={() => cancelChange(order.id, original)}
                            className="text-red-500 text-xs hover:underline"
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
          </div>
          <div className="flex justify-center gap-2 text-sm">
            <button
              disabled={page === 1}
              onClick={() => fetchOrders(page - 1)}
              className="bg-gray-200 px-2 py-1 rounded disabled:opacity-50"
            >
              ← Precedente
            </button>
            <span>
              Pagina {page} di {lastPage}
            </span>
            <button
              disabled={page === lastPage}
              onClick={() => fetchOrders(page + 1)}
              className="bg-gray-200 px-2 py-1 rounded disabled:opacity-50"
            >
              Successiva →
            </button>
          </div>
        </>
      ) : (
        <p>Nessun ordine trovato.</p>
      )}
    </div>
  );
};

export default OrderList;

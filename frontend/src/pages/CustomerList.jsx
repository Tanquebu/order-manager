import React, { useEffect, useState } from "react";
import api from "../api/axios";
import CustomerForm from "../component/CustomerForm";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchCustomers = async (page = 1) => {
    try {
      const res = await api.get(`/customers?page=${page}`);
      setCustomers(res.data.data);
      setPage(res.data.current_page);
      setLastPage(res.data.last_page);
    } catch (err) {
      setError("Errore nel caricamento clienti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreate = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Attenzione: eliminando questo cliente, saranno rimossi anche gli ordini in cui è presente. Vuoi continuare?")) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers(page);
    } catch (err) {
      console.error("Errore nella cancellazione:", err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, formData);
      } else {
        await api.post("/customers", formData);
      }
      setShowForm(false);
      setEditingCustomer(null);
      fetchCustomers(page);
    } catch (err) {
      console.error("Errore nel salvataggio:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Clienti</h1>
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          {showForm ? "Annulla" : "+ Aggiungi Cliente"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 border p-4 rounded bg-gray-50">
          <CustomerForm
            initialData={editingCustomer}
            onSubmit={handleSubmit}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}

      {loading && <p>Caricamento...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {customers.length > 0 ? (
        <>
          <table className="w-full border text-sm mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">ID</th>
                <th className="border px-3 py-2 text-left">Nome</th>
                <th className="border px-3 py-2 text-left">Email</th>
                <th className="border px-3 py-2 text-left">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td className="border px-3 py-2">{c.id}</td>
                  <td className="border px-3 py-2">{c.name}</td>
                  <td className="border px-3 py-2">{c.email}</td>
                  <td className="border px-3 py-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-blue-600 hover:underline mr-2 text-sm"
                    >
                      Modifica
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Elimina
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center gap-4 mt-2 text-sm">
            <button
              disabled={page === 1}
              onClick={() => fetchCustomers(page - 1)}
              className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
            >
              ← Precedente
            </button>
            <span>Pagina {page} di {lastPage}</span>
            <button
              disabled={page === lastPage}
              onClick={() => fetchCustomers(page + 1)}
              className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
            >
              Successiva →
            </button>
          </div>
        </>
      ) : (
        !loading && <p>Nessun cliente disponibile.</p>
      )}
    </div>
  );
};

export default CustomerList;

import React, { useEffect, useState } from "react";
import api from "../api/axios";
import CustomerForm from "../component/CustomerForm";

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    const fetchCustomers = async () => {
        try {
            const res = await api.get("/customers");
            setCustomers(res.data);
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
        if (!window.confirm("Sei sicuro di voler eliminare questo cliente?")) return;
        try {
          await api.delete(`/customers/${id}`);
          fetchCustomers();
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
            fetchCustomers();
        } catch (err) {
            console.error("Errore nel salvataggio:", err);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Clienti</h1>

            <button 
            onClick={handleCreate}
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                + Aggiungi Cliente
            </button>

            {loading && <p>Caricamento...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {customers.length > 0 ? (
                <table className="w-full border text-sm">
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
                                    className="text-blue-600 hover:underline mr-2">Modifica</button>
                                    <button
                                    onClick={() => handleDelete(c.id)}
                                     className="text-red-600 hover:underline">Elimina</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !loading && <p>Nessun cliente disponibile.</p>
            )}

            {showForm && (
                <CustomerForm
                    initialData={editingCustomer}
                    onSubmit={handleSubmit}
                    onClose={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default CustomerList;
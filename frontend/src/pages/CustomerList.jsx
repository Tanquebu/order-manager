import React, { useEffect, useState } from "react";
import api from "../api/axios";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Clienti</h1>

      <button className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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
                  <button className="text-blue-600 hover:underline mr-2">Modifica</button>
                  <button className="text-red-600 hover:underline">Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>Nessun cliente disponibile.</p>
      )}
    </div>
  );
};

export default CustomerList;
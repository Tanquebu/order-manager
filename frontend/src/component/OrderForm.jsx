import React, { useEffect, useState } from "react";
import api from "../api/axios";

const OrderForm = ({ onSuccess }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const fetchData = async () => {
      const [cRes, pRes] = await Promise.all([
        api.get("/customers"),
        api.get("/products"),
      ]);
      setCustomers(cRes.data);
      setProducts(pRes.data);
    };
    fetchData();
  }, []);

  const handleProductChange = (productId, quantity) => {
    const updated = [...selectedProducts];
    const index = updated.findIndex((p) => p.id === productId);
    if (index > -1) {
      updated[index].quantity = quantity;
    } else {
      updated.push({ id: productId, quantity });
    }
    setSelectedProducts(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/orders", {
        customer_id: selectedCustomer,
        products: selectedProducts,
        status,
      });
      onSuccess && onSuccess();
    } catch (err) {
      console.error("Errore creazione ordine:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm">Cliente</label>
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="w-full border p-2"
          required
        >
          <option value="">-- Seleziona cliente --</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Prodotti</label>
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                placeholder="Quantità"
                className="w-24 border p-1 text-sm"
                onChange={(e) =>
                  handleProductChange(p.id, parseInt(e.target.value, 10))
                }
              />
              <span className="text-sm">{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm">Stato</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-2"
        >
          <option value="pending">In attesa</option>
          <option value="processing">In elaborazione</option>
          <option value="shipped">Spedito</option>
          <option value="delivered">Consegnato</option>
          <option value="canceled">Annullato</option>
          <option value="closed">Chiuso</option>
        </select>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Salva Ordine
      </button>
    </form>
  );
};

export default OrderForm;
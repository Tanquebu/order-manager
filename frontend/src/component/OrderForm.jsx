import React, { useEffect, useState } from "react";
import api from "../api/axios";

const OrderForm = ({ onSuccess }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productToAdd, setProductToAdd] = useState("");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const fetchData = async () => {
      const [cRes, pRes] = await Promise.all([
        api.get("/customers"),
        api.get("/products"),
      ]);
      setCustomers(cRes.data.data);
      setProducts(pRes.data.data);
    };
    fetchData();
  }, []);

  const addProduct = () => {
    if (!productToAdd) return;

    const exists = selectedProducts.find((p) => p.id === productToAdd);
    if (!exists) {
      const product = products.find((p) => p.id === parseInt(productToAdd));
      if (product) {
        setSelectedProducts([
          ...selectedProducts,
          { id: product.id, name: product.name, quantity: 1 },
        ]);
      }
    }

    setProductToAdd("");
  };

  const updateQuantity = (id, quantity) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: parseInt(quantity, 10) || 1 } : p
      )
    );
  };

  const removeProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/orders", {
        customer_id: selectedCustomer,
        products: selectedProducts.map(({ id, quantity }) => ({
          id,
          quantity,
        })),
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
        <label className="block text-sm">Aggiungi prodotto</label>
        <div className="flex gap-2">
          <select
            value={productToAdd}
            onChange={(e) => setProductToAdd(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="">-- Seleziona prodotto --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addProduct}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Aggiungi
          </button>
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className="space-y-2">
          {selectedProducts.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <span className="w-40 text-sm">{p.name}</span>
              <input
                type="number"
                min={1}
                value={p.quantity}
                onChange={(e) => updateQuantity(p.id, e.target.value)}
                className="w-20 border p-1 text-sm"
              />
              <button
                type="button"
                onClick={() => removeProduct(p.id)}
                className="text-red-500 text-sm"
              >
                Rimuovi
              </button>
            </div>
          ))}
        </div>
      )}

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

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Salva Ordine
      </button>
    </form>
  );
};

export default OrderForm;
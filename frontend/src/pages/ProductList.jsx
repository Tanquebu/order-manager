import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ProductForm from "../component/ProductForm";
import { formatPrice } from "../utils/format";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      setError("Errore nel caricamento prodotti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
      } else {
        await api.post("/products", formData);
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Errore nel salvataggio prodotto:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo prodotto?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Errore nella cancellazione:", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Prodotti</h1>

      <button
        onClick={handleCreate}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Aggiungi Prodotto
      </button>

      {loading && <p>Caricamento...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {products.length > 0 ? (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">ID</th>
              <th className="border px-3 py-2 text-left">Nome</th>
              <th className="border px-3 py-2 text-left">Prezzo</th>
              <th className="border px-3 py-2 text-left">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
                console.log(p.price),
              <tr key={p.id}>
                <td className="border px-3 py-2">{p.id}</td>
                <td className="border px-3 py-2">{p.name}</td>
                <td className="border px-3 py-2">{formatPrice(p.price)}</td>
                <td className="border px-3 py-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Modifica
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>Nessun prodotto disponibile.</p>
      )}

      {showForm && (
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default ProductList;
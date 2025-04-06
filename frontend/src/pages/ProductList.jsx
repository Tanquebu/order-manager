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
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchProducts = async (page = 1) => {
    try {
      const res = await api.get(`/products?page=${page}`);
      setProducts(res.data.data);
      setPage(res.data.current_page);
      setLastPage(res.data.last_page);
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
      fetchProducts(page);
    } catch (err) {
      console.error("Errore nel salvataggio prodotto:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Attenzione: eliminando questo prodotto, sarà rimosso anche dagli ordini in cui è presente. Vuoi continuare?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts(page);
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
        <>
        <div className="flex justify-center gap-4 mb-4 text-sm">
          <button
            disabled={page === 1}
            onClick={() => fetchProducts(page - 1)}
            className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
          >
            ← Precedente
          </button>
          <span>Pagina {page} di {lastPage}</span>
          <button
            disabled={page === lastPage}
            onClick={() => fetchProducts(page + 1)}
            className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
          >
            Successiva →
          </button>
        </div>
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

        <div className="flex justify-center gap-4 mt-4 text-sm">
          <button
            disabled={page === 1}
            onClick={() => fetchProducts(page - 1)}
            className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
          >
            ← Precedente
          </button>
          <span>Pagina {page} di {lastPage}</span>
          <button
            disabled={page === lastPage}
            onClick={() => fetchProducts(page + 1)}
            className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
          >
            Successiva →
          </button>
        </div>
        </>
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
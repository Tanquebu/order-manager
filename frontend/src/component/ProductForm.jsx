import React, { useState, useEffect } from "react";

const ProductForm = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        price: initialData.price || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Il nome è obbligatorio";
    if (!formData.price || isNaN(formData.price)) newErrors.price = "Prezzo non valido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...formData, price: parseFloat(formData.price) });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {initialData ? "Modifica Prodotto" : "Aggiungi Prodotto"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Nome</label>
            <input
              type="text"
              name="name"
              className="w-full border p-2 rounded"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Prezzo (€)</label>
            <input
              type="number"
              name="price"
              className="w-full border p-2 rounded"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-sm rounded"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
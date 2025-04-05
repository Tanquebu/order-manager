import React from "react";

const OrderCard = ({ order }) => {
  const total = order.products.reduce(
    (acc, p) => acc + p.pivot.quantity * p.price,
    0
  );

  return (
    <div className="border p-4 mb-3 rounded shadow-sm">
      <div className="font-semibold text-lg mb-1">Ordine #{order.id}</div>
      <div className="text-sm text-gray-600 mb-2">
        Cliente: {order.customer?.name}
      </div>
      <div className="text-sm mb-2">
        Stato: <span className="font-medium">{order.status}</span>
      </div>
      <ul className="text-sm mb-2">
        {order.products.map((p) => (
          <li key={p.id}>
            {p.name} × {p.pivot.quantity} — €{(p.price * p.pivot.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
      <div className="font-semibold">Totale: €{total.toFixed(2)}</div>
    </div>
  );
};

export default OrderCard;
import React from "react";
import { formatPrice } from "../utils/format";

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
            {p.name} × {p.pivot.quantity} — {formatPrice(p.price * p.pivot.quantity)}
          </li>
        ))}
      </ul>
      <div className="font-semibold">Totale: {formatPrice(total)}</div>
    </div>
  );
};

export default OrderCard;
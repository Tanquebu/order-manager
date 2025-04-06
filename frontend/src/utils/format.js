
export function formatPrice(value, currency = "€") {
    const number = parseFloat(value);
    if (!Number.isFinite(number)) return "—";
    return `${currency} ${number.toFixed(2)}`;
  }
  
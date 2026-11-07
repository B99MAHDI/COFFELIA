import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext.jsx";

export default function AddToCartButton({ item, ghost = false }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <button
      type="button"
      className={"btn" + (ghost ? " ghost" : "")}
      aria-live="polite"
      onClick={() => {
        add(item);
        setDone(true);
      }}
    >
      {done ? "Ajouté au panier" : "Ajouter au panier"}
    </button>
  );
}

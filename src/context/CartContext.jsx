import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const KEY = "coffelia.cart";
export const MAX_QTY = 10;

const CartContext = createContext(null);

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(d) ? d.filter((x) => x && x.id && x.qty > 0) : [];
  } catch {
    return [];
  }
}

function reducer(state, a) {
  switch (a.type) {
    case "add": {
      const { id, name, price, url, type } = a.item;
      if (state.some((i) => i.id === id)) {
        return state.map((i) => (i.id === id ? { ...i, qty: Math.min(MAX_QTY, i.qty + 1) } : i));
      }
      // On garde un résumé de l'article pour afficher le panier même hors ligne
      return [...state, { id, name, price, url, type, qty: 1 }];
    }
    case "qty":
      return state.map((i) => (i.id === a.id ? { ...i, qty: Math.max(1, Math.min(MAX_QTY, a.qty)) } : i));
    case "remove":
      return state.filter((i) => i.id !== a.id);
    case "clear":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, null, load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      add: (item) => dispatch({ type: "add", item }),
      setQty: (id, qty) => dispatch({ type: "qty", id, qty }),
      remove: (id) => dispatch({ type: "remove", id }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans <CartProvider>");
  return ctx;
}

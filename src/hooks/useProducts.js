import { useCallback, useEffect, useState } from "react";
import { cachedProducts, fetchProducts } from "../lib/api.js";

// Renvoie d'abord le dernier catalogue connu (instantané), puis la version à jour
export default function useProducts() {
  const [items, setItems] = useState(() => cachedProducts());
  const [error, setError] = useState(false);

  const reload = useCallback(async () => {
    try {
      setItems(await fetchProducts());
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, error, reload };
}

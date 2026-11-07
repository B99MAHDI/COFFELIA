import { useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import useProducts from "../hooks/useProducts.js";
import usePageTitle from "../hooks/usePageTitle.js";

const FILTERS = [
  ["all", "Tout"],
  ["mug", "Mugs"],
  ["verre", "Verres"],
];

export default function Catalogue() {
  usePageTitle("Coffelia – Catalogue");
  const { items, error } = useProducts();
  const [filter, setFilter] = useState("all");

  const shown = (items || []).filter((it) => filter === "all" || it.type === filter);

  let message = null;
  if (!items) message = error ? "Le catalogue est momentanément indisponible. Retrouvez-nous sur Instagram." : "Chargement du catalogue…";
  else if (!items.length) message = "Les premiers articles arrivent bientôt. En attendant, retrouvez-les sur Instagram.";
  else if (!shown.length) message = "Aucun article dans cette catégorie pour le moment.";

  return (
    <section className="shop page">
      <div className="wrap">
        <div className="head">
          <h2>Le catalogue</h2>
          {items && items.length > 0 && (
            <div className="chips" role="group" aria-label="Filtrer par type">
              {FILTERS.map(([value, label]) => (
                <button key={value} type="button" className="chip" aria-pressed={filter === value} onClick={() => setFilter(value)}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="grid">
          {shown.map((it, i) => <ProductCard key={it.id} item={it} index={i} />)}
        </div>
        {message && <p className="note">{message}</p>}
      </div>
    </section>
  );
}

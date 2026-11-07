import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MAX_QTY, useCart } from "../context/CartContext.jsx";
import useProducts from "../hooks/useProducts.js";
import usePageTitle from "../hooks/usePageTitle.js";
import { fetchWhatsapp } from "../lib/api.js";
import { cleanWa, formatPrice, typeLabel } from "../lib/utils.js";
import { INSTAGRAM_URL } from "../config.js";

export default function Cart() {
  usePageTitle("Coffelia – Panier");
  const { items, setQty, remove, clear } = useCart();
  const { items: products } = useProducts();
  const [wa, setWa] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    fetchWhatsapp().then((v) => setWa(cleanWa(v))).catch(() => {});
  }, []);

  // Prix et disponibilité à jour : on compare avec le catalogue actuel
  const lines = useMemo(
    () =>
      items.map((it) => {
        const cur = products ? products.find((p) => p.id === it.id) : null;
        return {
          ...it,
          name: cur ? cur.name : it.name,
          price: cur ? cur.price : it.price,
          url: cur ? cur.url : it.url,
          unavailable: products ? !cur || !cur.available : false,
        };
      }),
    [items, products]
  );

  const valid = lines.filter((l) => !l.unavailable);
  const total = valid.reduce((n, l) => n + l.price * l.qty, 0);
  const units = valid.reduce((n, l) => n + l.qty, 0);

  const message = [
    "Bonjour Coffelia, je souhaite commander :",
    ...valid.map((l) => `- ${l.qty} × ${l.name} (${formatPrice(l.price)}) = ${formatPrice(l.price * l.qty)}`),
    `Total : ${formatPrice(total)}`,
    name.trim() && `Nom : ${name.trim()}`,
    city.trim() && `Ville / livraison : ${city.trim()}`,
    "Pouvez-vous m’envoyer les coordonnées pour le virement ?",
  ]
    .filter(Boolean)
    .join("\n");

  if (items.length === 0) {
    return (
      <section className="page">
        <div className="wrap">
          <h2>Votre panier</h2>
          <p className="intro">Votre panier est vide. Parcourez le catalogue pour choisir un mug ou un verre à café.</p>
          <Link className="btn" to="/catalogue">Voir le catalogue</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="wrap">
        <div className="head">
          <h2>Votre panier</h2>
          <Link className="back" style={{ margin: 0 }} to="/catalogue">← Continuer mes achats</Link>
        </div>

        <div className="cart">
          <div>
            {lines.map((l) => (
              <div className={"crow" + (l.unavailable ? " off" : "")} key={l.id}>
                <img src={l.url} alt="" />
                <div>
                  <h3>{l.name}</h3>
                  <p className="sub">
                    {typeLabel(l.type)} · {formatPrice(l.price)}
                  </p>
                  {l.unavailable && <p className="sub"><strong>Cet article n’est plus disponible. Il ne sera pas commandé.</strong></p>}
                </div>
                <div className="end">
                  {!l.unavailable && (
                    <div className="qty" role="group" aria-label={"Quantité de " + l.name}>
                      <button type="button" aria-label="Diminuer" disabled={l.qty <= 1} onClick={() => setQty(l.id, l.qty - 1)}>−</button>
                      <span aria-live="polite">{l.qty}</span>
                      <button type="button" aria-label="Augmenter" disabled={l.qty >= MAX_QTY} onClick={() => setQty(l.id, l.qty + 1)}>+</button>
                    </div>
                  )}
                  {!l.unavailable && <strong>{formatPrice(l.price * l.qty)}</strong>}
                  <button type="button" className="linkbtn" onClick={() => remove(l.id)}>Retirer</button>
                </div>
              </div>
            ))}
            <div style={{ marginTop: "1rem" }}>
              {confirmClear ? (
                <button type="button" className="linkbtn" onClick={() => { clear(); setConfirmClear(false); }}>Confirmer : vider le panier</button>
              ) : (
                <button type="button" className="linkbtn" onClick={() => setConfirmClear(true)}>Vider le panier</button>
              )}
            </div>
          </div>

          <aside className="summary" aria-label="Récapitulatif de la commande">
            <h3>Récapitulatif</h3>
            <div className="total">
              <span>{units} article{units > 1 ? "s" : ""}</span>
              <span>{formatPrice(total)}</span>
            </div>
            <p className="hint">Paiement par virement, en privé. Nous vous envoyons les coordonnées après votre message.</p>
            <label htmlFor="cName">
              Votre nom (facultatif)
              <input id="cName" type="text" maxLength={60} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label htmlFor="cCity">
              Ville ou adresse de livraison (facultatif)
              <input id="cCity" type="text" maxLength={120} autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} />
            </label>
            {valid.length === 0 ? (
              <span className="btn off">Aucun article à commander</span>
            ) : wa ? (
              <a className="btn" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${wa}?text=${encodeURIComponent(message)}`}>
                Commander sur WhatsApp
              </a>
            ) : (
              <>
                <p className="hint">Le contact WhatsApp n’est pas encore disponible. Écrivez-nous sur Instagram pour commander.</p>
                <a className="btn" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Écrire sur Instagram</a>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

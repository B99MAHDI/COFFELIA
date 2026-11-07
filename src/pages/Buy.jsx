import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProduct, fetchWhatsapp } from "../lib/api.js";
import { cleanWa, formatPrice, typeLabel } from "../lib/utils.js";
import AddToCartButton from "../components/AddToCartButton.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { INSTAGRAM_URL } from "../config.js";

export default function Buy() {
  const { id } = useParams();
  const [state, setState] = useState({ status: "loading" });
  const [name, setName] = useState("");
  usePageTitle(state.item ? "Coffelia – " + state.item.name : "Coffelia – Acheter");

  useEffect(() => {
    let alive = true;
    setState({ status: "loading" });
    Promise.all([fetchProduct(id), fetchWhatsapp()])
      .then(([item, wa]) => alive && setState(item ? { status: "ok", item, wa: cleanWa(wa) } : { status: "missing" }))
      .catch(() => alive && setState({ status: "error" }));
    return () => {
      alive = false;
    };
  }, [id]);

  let body;
  if (state.status === "loading") body = <p className="intro">Chargement…</p>;
  else if (state.status === "missing") body = <p className="intro">Cet article n’est plus disponible.</p>;
  else if (state.status === "error")
    body = <p className="intro">Le catalogue est momentanément indisponible. Réessayez plus tard ou écrivez-nous sur Instagram.</p>;
  else {
    const { item, wa } = state;
    const message =
      `Bonjour Coffelia, je souhaite acheter l’article « ${item.name} » (${formatPrice(item.price)}).` +
      (name.trim() ? ` Mon nom : ${name.trim()}.` : "") +
      " Pouvez-vous m’envoyer les coordonnées pour le virement ?";

    let action;
    if (!item.available) {
      action = <p className="intro">Cet article est épuisé pour le moment. Écrivez-nous sur Instagram pour savoir quand il revient.</p>;
    } else if (wa) {
      action = (
        <>
          <h3>Ou commandez cet article seul</h3>
          <ol>
            <li>Indiquez votre nom (facultatif).</li>
            <li>Continuez sur WhatsApp : le message est déjà prêt.</li>
            <li>Nous vous envoyons les coordonnées pour le virement.</li>
          </ol>
          <label htmlFor="buyName">
            Votre nom
            <input id="buyName" type="text" maxLength={60} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <a className="btn" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${wa}?text=${encodeURIComponent(message)}`}>
            Continuer sur WhatsApp
          </a>
        </>
      );
    } else {
      action = (
        <>
          <p className="intro">Le contact WhatsApp n’est pas encore disponible. Écrivez-nous sur Instagram pour acheter cet article.</p>
          <a className="btn" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Écrire sur Instagram</a>
        </>
      );
    }

    body = (
      <div className="checkout">
        <img className="photo" src={item.url} alt={item.name} />
        <div>
          <p className="kind">{typeLabel(item.type)}</p>
          <h2>{item.name}</h2>
          <p className="big">{formatPrice(item.price)}</p>
          {item.desc && <p className="intro">{item.desc}</p>}
          {item.available && (
            <div className="btn-row" style={{ marginBottom: "2rem" }}>
              <AddToCartButton item={item} />
              <Link className="btn ghost" to="/panier">Voir le panier</Link>
            </div>
          )}
          {action}
        </div>
      </div>
    );
  }

  return (
    <section className="page">
      <div className="wrap">
        <Link className="back" to="/catalogue">← Retour au catalogue</Link>
        {body}
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { Glass, Mug } from "../components/Illustrations.jsx";
import useProducts from "../hooks/useProducts.js";
import usePageTitle from "../hooks/usePageTitle.js";
import { INSTAGRAM_URL } from "../config.js";
import logo from "../assets/img/logo.jpg";

const TICKER = ["Mugs", "Verres à café", "Coffee. Love. Every moment.", "Livraison au Maroc"];

export default function Home() {
  usePageTitle("Coffelia – Mugs et verres à café stylés");
  const { items, error } = useProducts();

  const list = (items || []).filter((x) => x.available).slice(0, 3);
  let message = null;
  if (!items) message = error ? "Le catalogue est momentanément indisponible. Retrouvez-nous sur Instagram." : "Chargement…";
  else if (!list.length) message = "Les premiers articles arrivent bientôt. En attendant, retrouvez-les sur Instagram.";

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <span className="tag">Mugs &amp; verres à café</span>
            <h1>Un café, un mug, <mark>un sourire.</mark></h1>
            <p className="lead">
              Des mugs et des verres à café choisis pour leurs couleurs et leur caractère. Parce que la pause du matin mérite mieux qu’un gobelet.
            </p>
            <div className="row">
              <Link className="btn" to="/catalogue">Voir le catalogue</Link>
              <a className="btn ghost" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
          <div className="stage">
            <div className="blob" />
            <div className="logo-card"><img src={logo} alt="Logo Coffelia" /></div>
            <div className="float a"><Mug color="#F2A9A0" /></div>
            <div className="float b"><Glass color="#5A3426" /></div>
            <svg className="stamp" viewBox="0 0 120 120" role="img" aria-label="Coffee. Love. Every moment.">
              <circle cx="60" cy="60" r="58" fill="#D5E5B8" />
              <defs><path id="circ" d="M60 60m-42 0a42 42 0 1 1 84 0a42 42 0 1 1-84 0" /></defs>
              <text><textPath href="#circ" textLength="258" lengthAdjust="spacing">Coffee · Love · Every moment · </textPath></text>
              <path d="M60 50c-7-8-16 3-8 10l8 8 8-8c8-7-1-18-8-10z" fill="#2B1710" />
            </svg>
          </div>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div>
          {[...TICKER, ...TICKER].map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>

      <section className="shop">
        <div className="wrap">
          <div className="head"><h2>Les nouveautés</h2></div>
          <div className="grid">
            {list.map((it, i) => <ProductCard key={it.id} item={it} index={i} />)}
          </div>
          {message && <p className="note">{message}</p>}
          <div className="more"><Link className="btn ghost" to="/catalogue">Voir tout le catalogue</Link></div>
        </div>
      </section>

      <section className="band" id="commander">
        <div className="wrap">
          <h2>Commander, c’est simple</h2>
          <div className="step"><b>1</b><h3>Choisissez</h3><p>Parcourez le catalogue et cliquez sur Acheter.</p></div>
          <div className="step"><b>2</b><h3>Écrivez-nous</h3><p>Un message WhatsApp déjà rédigé s’ouvre avec votre article.</p></div>
          <div className="step"><b>3</b><h3>Payez en privé</h3><p>Nous vous envoyons les coordonnées pour le virement.</p></div>
        </div>
      </section>
    </>
  );
}

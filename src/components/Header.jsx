import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Header() {
  const { count } = useCart();
  return (
    <header className="top">
      <div className="wrap">
        <Link className="brand" to="/">Coffelia</Link>
        <nav className="pills" aria-label="Navigation">
          <NavLink to="/" end>Accueil</NavLink>
          <NavLink to="/catalogue">Catalogue</NavLink>
          <Link to="/" state={{ scroll: "commander" }}>Commander</Link>
          <NavLink to="/panier" aria-label={count ? `Panier, ${count} article${count > 1 ? "s" : ""}` : "Panier"}>
            Panier{count > 0 && <span className="cart-count">{count}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

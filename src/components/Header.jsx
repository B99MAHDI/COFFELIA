import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="top">
      <div className="wrap">
        <Link className="brand" to="/">Coffelia</Link>
        <nav className="pills" aria-label="Navigation">
          <NavLink to="/" end>Accueil</NavLink>
          <NavLink to="/catalogue">Catalogue</NavLink>
          <Link to="/" state={{ scroll: "commander" }}>Commander</Link>
        </nav>
      </div>
    </header>
  );
}

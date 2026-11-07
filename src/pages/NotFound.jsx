import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle.js";

export default function NotFound() {
  usePageTitle("Coffelia – Page introuvable");
  return (
    <section className="page">
      <div className="wrap">
        <h2>Page introuvable</h2>
        <p className="intro">Cette page n’existe pas ou a été déplacée.</p>
        <Link className="btn" to="/">Retour à l’accueil</Link>
      </div>
    </section>
  );
}

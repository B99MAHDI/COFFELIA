import { Link } from "react-router-dom";
import { INSTAGRAM_URL } from "../config.js";

export default function Footer({ showAdmin = true }) {
  return (
    <footer>
      <div className="wrap">
        <span className="brand">Coffelia</span>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">@coffelia1</a>
        <span>
          © 2026 Coffelia
          {showAdmin && (
            <>
              {" · "}
              <Link className="admin-link" to="/admin/connexion">Espace admin</Link>
            </>
          )}
        </span>
      </div>
    </footer>
  );
}

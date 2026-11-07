import { Link, Outlet } from "react-router-dom";
import Footer from "./Footer.jsx";
import ScrollManager from "./ScrollManager.jsx";

export default function AdminLayout() {
  return (
    <>
      <ScrollManager />
      <header className="top">
        <div className="wrap">
          <Link className="brand" to="/">Coffelia</Link>
          <nav className="pills" aria-label="Navigation">
            <Link to="/">Retour au site</Link>
            <Link to="/catalogue">Voir le catalogue</Link>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <Footer showAdmin={false} />
    </>
  );
}

import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isAdmin } from "../lib/api.js";
import { sb } from "../lib/supabase.js";
import useAdmin from "../hooks/useAdmin.js";
import usePageTitle from "../hooks/usePageTitle.js";

export default function Login() {
  usePageTitle("Coffelia – Connexion");
  const navigate = useNavigate();
  const status = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(sb ? "" : "Connexion à la base impossible. Vérifiez src/config.js.");

  if (status === "yes") return <Navigate to="/admin" replace />;

  async function submit(e) {
    e.preventDefault();
    if (!sb) return;
    setBusy(true);
    setMessage("Connexion…");
    try {
      const r = await sb.auth.signInWithPassword({ email: email.trim(), password });
      if (r.error) {
        setMessage("E-mail ou mot de passe incorrect.");
      } else if (await isAdmin()) {
        navigate("/admin", { replace: true });
        return;
      } else {
        await sb.auth.signOut();
        setMessage("Ce compte n’a pas accès à la gestion.");
      }
    } catch {
      setMessage("Connexion impossible. Réessayez.");
    }
    setBusy(false);
  }

  return (
    <section className="page form-page">
      <div className="wrap" style={{ display: "grid", placeItems: "center" }}>
        <div className="panel">
          <h2 style={{ fontSize: "2.2rem" }}>Connexion</h2>
          <p className="hint" style={{ marginTop: ".5rem" }}>Espace réservé aux administrateurs de Coffelia.</p>
          <form onSubmit={submit}>
            <label htmlFor="lEmail">
              E-mail
              <input id="lEmail" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label htmlFor="lPass">
              Mot de passe
              <input id="lPass" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button className="btn" type="submit" disabled={busy}>Se connecter</button>
          </form>
          <p role="status" className="hint" style={{ margin: "1rem 0 0" }}>{message}</p>
        </div>
      </div>
    </section>
  );
}

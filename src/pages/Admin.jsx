import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { addProduct, deleteProduct, fetchWhatsapp, saveWhatsapp, setAvailable } from "../lib/api.js";
import { sb } from "../lib/supabase.js";
import { cleanWa, formatPrice, typeLabel } from "../lib/utils.js";
import useAdmin from "../hooks/useAdmin.js";
import useProducts from "../hooks/useProducts.js";
import usePageTitle from "../hooks/usePageTitle.js";

const EMPTY = { name: "", type: "mug", price: "", description: "", available: true, file: null };

function AddForm({ onAdded, say }) {
  const [form, setForm] = useState(EMPTY);
  const [fileKey, setFileKey] = useState(0);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  useEffect(() => {
    if (!form.file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(form.file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [form.file]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    say("Ajout en cours…");
    try {
      await addProduct({
        name: form.name.trim(),
        price: Number(form.price),
        type: form.type,
        description: form.description.trim(),
        available: form.available,
        file: form.file,
      });
      setForm(EMPTY);
      setFileKey((k) => k + 1);
      say("Article ajouté.");
      await onAdded();
    } catch {
      say("L’ajout a échoué. Vérifiez la photo et votre connexion.");
    }
    setBusy(false);
  }

  return (
    <div className="panel">
      <h3>Ajouter un article</h3>
      <form onSubmit={submit}>
        <label htmlFor="fName">
          Nom
          <input id="fName" type="text" maxLength={60} required value={form.name} onChange={set("name")} />
        </label>
        <label htmlFor="fType">
          Type
          <select id="fType" value={form.type} onChange={set("type")}>
            <option value="mug">Mug</option>
            <option value="verre">Verre à café</option>
          </select>
        </label>
        <label htmlFor="fPrice">
          Prix (en DH)
          <input id="fPrice" type="number" min="0" step="any" inputMode="decimal" required value={form.price} onChange={set("price")} />
        </label>
        <label htmlFor="fDesc">
          Description (facultatif)
          <textarea id="fDesc" maxLength={300} placeholder="Matière, contenance, couleur…" value={form.description} onChange={set("description")} />
        </label>
        <label className="check" htmlFor="fAvail">
          <input id="fAvail" type="checkbox" checked={form.available} onChange={set("available")} /> Disponible à la vente
        </label>
        <label htmlFor="fPhoto">
          Photo
          <input
            key={fileKey}
            id="fPhoto"
            type="file"
            accept="image/*"
            required
            onChange={(e) => setForm((f) => ({ ...f, file: e.target.files[0] || null }))}
          />
        </label>
        {preview && <img className="preview" src={preview} alt="Aperçu de la photo" />}
        <button className="btn" type="submit" disabled={busy}>Ajouter au catalogue</button>
      </form>
    </div>
  );
}

function WhatsappForm({ say }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    fetchWhatsapp().then(setValue).catch(() => {});
  }, []);

  async function submit(e) {
    e.preventDefault();
    const raw = value.trim();
    const n = cleanWa(raw);
    if (raw && !n) {
      say("Numéro invalide. Vérifiez l’indicatif et les chiffres.");
      return;
    }
    try {
      await saveWhatsapp(n);
      say("Numéro enregistré.");
    } catch {
      say("L’enregistrement a échoué.");
    }
  }

  return (
    <div className="panel">
      <h3>Contact WhatsApp pour le paiement</h3>
      <form onSubmit={submit}>
        <label htmlFor="fWa">
          Numéro WhatsApp (avec l’indicatif, ou 06… pour le Maroc)
          <input id="fWa" type="tel" inputMode="tel" autoComplete="off" value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        <button className="btn" type="submit">Enregistrer le numéro</button>
      </form>
    </div>
  );
}

export default function Admin() {
  usePageTitle("Coffelia – Gestion");
  const navigate = useNavigate();
  const status = useAdmin();
  const { items, reload } = useProducts();
  const [message, setMessage] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  if (status === "no") return <Navigate to="/admin/connexion" replace />;
  if (status === "checking")
    return (
      <section className="page adm">
        <div className="wrap"><p className="intro">Vérification de la connexion…</p></div>
      </section>
    );

  async function toggle(it) {
    try {
      await setAvailable(it.id, !it.available);
      await reload();
    } catch {
      setMessage("La modification a échoué.");
    }
  }

  async function remove(it) {
    if (confirmId !== it.id) {
      setConfirmId(it.id);
      return;
    }
    try {
      await deleteProduct(it);
      setConfirmId(null);
      await reload();
    } catch {
      setMessage("La suppression a échoué.");
    }
  }

  async function logout() {
    if (sb) await sb.auth.signOut();
    navigate("/admin/connexion", { replace: true });
  }

  return (
    <section className="page adm">
      <div className="wrap">
        <div className="head">
          <h2>Gestion</h2>
          <button className="chip" type="button" onClick={logout}>Se déconnecter</button>
        </div>
        <p role="status" className="intro">{message}</p>

        <AddForm onAdded={reload} say={setMessage} />
        <WhatsappForm say={setMessage} />

        <h3 className="lst">Articles du catalogue</h3>
        <div>
          {items && items.length === 0 && <p className="note">Aucun article pour le moment.</p>}
          {(items || []).map((it) => (
            <div className="arow" key={it.id}>
              <img src={it.url} alt="" />
              <span>
                {it.name} ({typeLabel(it.type).toLowerCase()}) – {formatPrice(it.price)}
                {!it.available && <em className="tag2">Épuisé</em>}
              </span>
              <div className="acts">
                <button type="button" onClick={() => toggle(it)}>{it.available ? "Marquer épuisé" : "Remettre en vente"}</button>
                <button type="button" onClick={() => remove(it)}>{confirmId === it.id ? "Confirmer" : "Supprimer"}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

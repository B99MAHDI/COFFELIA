import { useEffect, useState } from "react";
import { updateProduct } from "../lib/api.js";

export default function EditProductForm({ item, onSaved, onClose }) {
  const [form, setForm] = useState({
    name: item.name,
    type: item.type,
    price: String(item.price),
    description: item.desc,
    available: item.available,
    file: null,
  });
  const [fileKey, setFileKey] = useState(0);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null); // { kind: "ok" | "info" | "err", text }

  const set = (field) => (e) => {
    setFeedback(null);
    setForm((f) => ({ ...f, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  };

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
    const next = {
      name: form.name.trim(),
      price: Number(form.price),
      type: form.type,
      description: form.description.trim(),
      available: form.available,
    };
    const unchanged =
      !form.file &&
      next.name === item.name &&
      next.price === item.price &&
      next.type === item.type &&
      next.description === item.desc &&
      next.available === item.available;
    if (unchanged) {
      setFeedback({ kind: "info", text: "Aucune modification à enregistrer." });
      return;
    }
    setBusy(true);
    try {
      await updateProduct(item, { ...next, file: form.file });
      await onSaved();
      setForm((f) => ({ ...f, file: null }));
      setFileKey((k) => k + 1);
      setFeedback({ kind: "ok", text: "Modifications enregistrées." });
    } catch {
      setFeedback({ kind: "err", text: "Les modifications n’ont pas été enregistrées. Vérifiez votre connexion et réessayez." });
    }
    setBusy(false);
  }

  const id = (n) => `e${item.id}-${n}`;

  return (
    <div className="panel edit">
      <h3>Modifier « {item.name} »</h3>
      <form onSubmit={submit}>
        <label htmlFor={id("name")}>
          Nom
          <input id={id("name")} type="text" maxLength={60} required value={form.name} onChange={set("name")} />
        </label>
        <label htmlFor={id("type")}>
          Type
          <select id={id("type")} value={form.type} onChange={set("type")}>
            <option value="mug">Mug</option>
            <option value="verre">Verre à café</option>
          </select>
        </label>
        <label htmlFor={id("price")}>
          Prix (en DH)
          <input id={id("price")} type="number" min="0" step="any" inputMode="decimal" required value={form.price} onChange={set("price")} />
        </label>
        <label htmlFor={id("desc")}>
          Description (facultatif)
          <textarea id={id("desc")} maxLength={300} value={form.description} onChange={set("description")} />
        </label>
        <label className="check" htmlFor={id("avail")}>
          <input id={id("avail")} type="checkbox" checked={form.available} onChange={set("available")} /> Disponible à la vente
        </label>
        <p className="hint">{preview ? "Nouvelle photo :" : "Photo actuelle :"}</p>
        <img className="preview" src={preview || item.url} alt="" />
        <label htmlFor={id("photo")}>
          Remplacer la photo (facultatif)
          <input
            key={fileKey}
            id={id("photo")}
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFeedback(null);
              setForm((f) => ({ ...f, file: e.target.files[0] || null }));
            }}
          />
        </label>
        {feedback && <p className={"msg " + feedback.kind} role="status">{feedback.text}</p>}
        <div className="btn-row">
          <button className="btn" type="submit" disabled={busy}>Enregistrer les modifications</button>
          <button className="btn ghost" type="button" onClick={onClose}>Fermer</button>
        </div>
      </form>
    </div>
  );
}

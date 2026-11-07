import { sb } from "./supabase.js";
import { shrinkImage } from "./utils.js";

const KEY = "coffelia.products";

const need = () => {
  if (!sb) throw new Error("Supabase n'est pas configuré (src/config.js)");
  return sb;
};

export const mapProduct = (x) => ({
  id: x.id,
  name: x.name,
  price: Number(x.price),
  url: x.image_url,
  type: x.type === "verre" ? "verre" : "mug",
  desc: x.description || "",
  available: x.available !== false,
});

// Dernier catalogue connu : permet d'afficher la page tout de suite
export function cachedProducts() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(d) ? d : null;
  } catch {
    return null;
  }
}

export async function fetchProducts() {
  const { data, error } = await need().from("products").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  const list = (data || []).map(mapProduct);
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
  return list;
}

export async function fetchProduct(id) {
  const { data, error } = await need().from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data) : null;
}

export async function fetchWhatsapp() {
  const { data } = await need().from("settings").select("value").eq("key", "whatsapp").maybeSingle();
  return (data && data.value) || "";
}

export async function saveWhatsapp(value) {
  const { error } = await need().from("settings").upsert({ key: "whatsapp", value });
  if (error) throw error;
}

export async function addProduct({ name, price, type, description, available, file }) {
  const client = need();
  const blob = await shrinkImage(file);
  const path = crypto.randomUUID() + ".jpg";
  const up = await client.storage.from("products").upload(path, blob, { contentType: "image/jpeg" });
  if (up.error) throw up.error;
  const url = client.storage.from("products").getPublicUrl(path).data.publicUrl;
  const { error } = await client.from("products").insert({
    name,
    price,
    type,
    description: description || null,
    available,
    image_url: url,
  });
  if (error) throw error;
}

export async function setAvailable(id, available) {
  const { error } = await need().from("products").update({ available }).eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(item) {
  const client = need();
  const { error } = await client.from("products").delete().eq("id", item.id);
  if (error) throw error;
  await client.storage.from("products").remove([item.url.split("/").pop()]);
}

export async function isAdmin() {
  if (!sb) return false;
  const { data } = await sb.auth.getSession();
  if (!data.session) return false;
  const r = await sb.rpc("is_admin");
  return !r.error && !!r.data;
}

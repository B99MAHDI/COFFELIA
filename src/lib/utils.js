const fmt = new Intl.NumberFormat("fr-FR");

export const formatPrice = (n) => fmt.format(n) + " DH";

export const typeLabel = (t) => (t === "verre" ? "Verre à café" : "Mug");

// Numéro WhatsApp : garde les chiffres, accepte 00… ou 06… (Maroc)
export function cleanWa(n) {
  let s = String(n || "").replace(/\D/g, "");
  if (s.startsWith("00")) s = s.slice(2);
  else if (s.startsWith("0")) s = "212" + s.slice(1);
  return s.length >= 8 ? s : "";
}

// Réduit une photo à 900 px de large maximum avant l'envoi (chargement plus rapide)
export function shrinkImage(file, max = 900) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * s);
      c.height = Math.round(img.height * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("image"))), "image/jpeg", 0.85);
    };
    img.onerror = () => reject(new Error("image"));
    img.src = url;
  });
}

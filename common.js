/* Fonctions partagées par toutes les pages de Coffelia */
(function () {
  var cfg = window.COFFELIA_CONFIG || {};
  var sb = null;
  try { sb = supabase.createClient(cfg.url, cfg.anonKey); } catch (e) { sb = null; }

  var C = {
    sb: sb,
    INSTA: "https://www.instagram.com/coffelia1/",
    COLORS: ["blush", "pistache", "latte", "lilac"],
    fmt: new Intl.NumberFormat("fr-FR")
  };

  C.$ = function (id) { return document.getElementById(id); };

  C.el = function (tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };

  C.price = function (it) { return C.fmt.format(it.price) + " DH"; };

  C.typeLabel = function (t) { return t === "verre" ? "Verre à café" : "Mug"; };

  C.cleanWa = function (n) {
    var s = String(n || "").replace(/\D/g, "");
    if (s.indexOf("00") === 0) s = s.slice(2);
    else if (s.charAt(0) === "0") s = "212" + s.slice(1);
    return s.length >= 8 ? s : "";
  };

  C.map = function (x) {
    return {
      id: x.id,
      name: x.name,
      price: Number(x.price),
      url: x.image_url,
      type: x.type === "verre" ? "verre" : "mug",
      desc: x.description || "",
      available: x.available !== false
    };
  };

  C.products = async function () {
    if (!sb) throw new Error("Supabase indisponible");
    var r = await sb.from("products").select("*").order("created_at", { ascending: false });
    if (r.error) throw r.error;
    return (r.data || []).map(C.map);
  };

  C.whatsapp = async function () {
    if (!sb) return "";
    var r = await sb.from("settings").select("value").eq("key", "whatsapp").maybeSingle();
    return (r.data && r.data.value) || "";
  };

  C.isAdmin = async function () {
    if (!sb) return false;
    var s = (await sb.auth.getSession()).data.session;
    if (!s) return false;
    var r = await sb.rpc("is_admin");
    return !r.error && !!r.data;
  };

  C.card = function (it, i) {
    var a = C.el("article", "card " + C.COLORS[i % C.COLORS.length]);
    var wrap = C.el("div", "photo-wrap"), img = C.el("img", "photo");
    img.src = it.url; img.alt = it.name; img.loading = "lazy";
    wrap.append(img);
    if (!it.available) wrap.append(C.el("span", "badge", "Épuisé"));
    var meta = C.el("div", "meta");
    meta.append(C.el("h3", null, it.name), C.el("span", "price", C.price(it)));
    a.append(wrap, meta, C.el("p", "kind", C.typeLabel(it.type)));
    if (it.desc) a.append(C.el("p", "desc", it.desc));
    var b;
    if (it.available) {
      b = C.el("a", "btn", "Acheter");
      b.href = "acheter.html?id=" + encodeURIComponent(it.id);
    } else {
      b = C.el("span", "btn off", "Indisponible");
    }
    a.append(b);
    return a;
  };

  window.Coffelia = C;
})();

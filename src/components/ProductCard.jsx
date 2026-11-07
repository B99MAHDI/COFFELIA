import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton.jsx";
import { formatPrice, typeLabel } from "../lib/utils.js";

const COLORS = ["blush", "pistache", "latte", "lilac"];

export default function ProductCard({ item, index }) {
  const detail = "/acheter/" + item.id;
  return (
    <article className={"card " + COLORS[index % COLORS.length]}>
      <Link className="photo-wrap" to={detail} aria-label={"Voir " + item.name}>
        <img className="photo" src={item.url} alt={item.name} loading="lazy" decoding="async" />
        {!item.available && <span className="badge">Épuisé</span>}
      </Link>
      <div className="meta">
        <h3><Link to={detail}>{item.name}</Link></h3>
        <span className="price">{formatPrice(item.price)}</span>
      </div>
      <p className="kind">{typeLabel(item.type)}</p>
      {item.desc && <p className="desc">{item.desc}</p>}
      {item.available ? <AddToCartButton item={item} /> : <span className="btn off">Indisponible</span>}
    </article>
  );
}

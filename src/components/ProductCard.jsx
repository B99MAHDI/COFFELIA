import { Link } from "react-router-dom";
import { formatPrice, typeLabel } from "../lib/utils.js";

const COLORS = ["blush", "pistache", "latte", "lilac"];

export default function ProductCard({ item, index }) {
  return (
    <article className={"card " + COLORS[index % COLORS.length]}>
      <div className="photo-wrap">
        <img className="photo" src={item.url} alt={item.name} loading="lazy" decoding="async" />
        {!item.available && <span className="badge">Épuisé</span>}
      </div>
      <div className="meta">
        <h3>{item.name}</h3>
        <span className="price">{formatPrice(item.price)}</span>
      </div>
      <p className="kind">{typeLabel(item.type)}</p>
      {item.desc && <p className="desc">{item.desc}</p>}
      {item.available ? (
        <Link className="btn" to={"/acheter/" + item.id}>Acheter</Link>
      ) : (
        <span className="btn off">Indisponible</span>
      )}
    </article>
  );
}

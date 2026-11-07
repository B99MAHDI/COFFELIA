import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Remonte en haut à chaque changement de page, ou défile vers la section demandée
export default function ScrollManager() {
  const { pathname, state, key } = useLocation();

  useEffect(() => {
    const target = state && state.scroll;
    const t = setTimeout(() => {
      const el = target && document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo(0, 0);
    }, 0);
    return () => clearTimeout(t);
  }, [pathname, state, key]);

  return null;
}

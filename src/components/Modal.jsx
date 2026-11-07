import { useEffect, useRef } from "react";

// Fenêtre modale basée sur l'élément natif <dialog> :
// le focus reste dans la fenêtre, Échap la ferme, et le fond est grisé.
export default function Modal({ title, onClose, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="modalTitle"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // clic sur le fond grisé
      }}
    >
      <div className="panel">
        <div className="modal-head">
          <h3 id="modalTitle">{title}</h3>
          <button type="button" className="modal-x" aria-label="Fermer la fenêtre" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

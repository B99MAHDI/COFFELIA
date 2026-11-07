import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import "./styles/style.css";

// HashRouter : les adresses du type /#/catalogue fonctionnent sur GitHub Pages sans configuration
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </HashRouter>
  </React.StrictMode>
);

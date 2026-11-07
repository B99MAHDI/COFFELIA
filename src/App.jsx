import { Route, Routes } from "react-router-dom";
import PublicLayout from "./components/PublicLayout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import Home from "./pages/Home.jsx";
import Catalogue from "./pages/Catalogue.jsx";
import Buy from "./pages/Buy.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="catalogue" element={<Catalogue />} />
        <Route path="acheter/:id" element={<Buy />} />
        <Route path="panier" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Admin />} />
        <Route path="connexion" element={<Login />} />
      </Route>
    </Routes>
  );
}

import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import ScrollManager from "./ScrollManager.jsx";

export default function PublicLayout() {
  return (
    <>
      <ScrollManager />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

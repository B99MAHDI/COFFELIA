import { useEffect, useState } from "react";
import { isAdmin } from "../lib/api.js";

// "checking" | "yes" | "no"
export default function useAdmin() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let alive = true;
    isAdmin()
      .then((ok) => alive && setStatus(ok ? "yes" : "no"))
      .catch(() => alive && setStatus("no"));
    return () => {
      alive = false;
    };
  }, []);

  return status;
}

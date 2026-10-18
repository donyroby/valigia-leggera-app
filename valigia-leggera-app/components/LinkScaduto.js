"use client";
// Link di accesso scaduto o già usato: Supabase rimanda al sito con "#error=...&error_code=otp_expired".
// Se l'utente è già collegato si pulisce solo l'indirizzo; altrimenti si va ad "Accedi" con un messaggio chiaro.
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LinkScaduto() {
  const path = usePathname();
  const router = useRouter();
  useEffect(() => {
    const h = window.location.hash || "";
    const q = new URLSearchParams(window.location.search);
    const errHash = /(^#|&)error(_code)?=/.test(h);
    const errQuery = q.get("errore") === "link";
    const codice = q.has("code"); // residuo del link appena usato
    if (!errHash && !errQuery && !codice) return;
    (async () => {
      let user = null;
      try { ({ data: { user } } = await createClient().auth.getUser()); } catch {}
      if (user) {
        q.delete("errore");
        if (codice) { q.delete("code"); q.delete("next"); }
        const resto = q.toString();
        window.history.replaceState(null, "", window.location.pathname + (resto ? "?" + resto : ""));
      } else if (errHash || (errQuery && !path.startsWith("/accedi"))) {
        router.replace("/accedi?errore=link");
      }
    })();
  }, [path, router]);
  return null;
}

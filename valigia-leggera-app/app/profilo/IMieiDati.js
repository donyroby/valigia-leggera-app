"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const PAROLA = "ELIMINA";

// Diritti sui propri dati: scaricarli tutti ed eliminare l'account
export default function IMieiDati({ email }) {
  const [stato, setStato] = useState("idle"); // idle | scarico | conferma | elimino
  const [testo, setTesto] = useState("");
  const [errore, setErrore] = useState("");

  async function scarica() {
    setStato("scarico"); setErrore("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("sessione");
      const [p, v, s] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("saved_trips").select("*").order("created_at", { ascending: true }),
        supabase.from("piggy_bank").select("*").eq("user_id", user.id).maybeSingle(),
      ]);
      if (p.error || v.error || s.error) throw new Error("lettura");
      const dati = {
        nota: "Dati del tuo account Valigia Leggera, esportati su tua richiesta.",
        esportato_il: new Date().toISOString(),
        account: { id: user.id, email: user.email, creato_il: user.created_at, ultimo_accesso: user.last_sign_in_at },
        profilo: p.data,
        viaggi_salvati: v.data,
        salvadanaio: s.data,
      };
      const blob = new Blob([JSON.stringify(dati, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "valigia-leggera-i-miei-dati.json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStato("idle");
    } catch {
      setStato("idle");
      setErrore("Non sono riuscito a preparare il file. Ricarica la pagina e riprova.");
    }
  }

  async function elimina() {
    if (testo.trim().toUpperCase() !== PAROLA) return;
    setStato("elimino"); setErrore("");
    const supabase = createClient();
    const { error } = await supabase.rpc("delete_my_account");
    if (error) {
      setStato("conferma");
      setErrore("L'eliminazione non è riuscita: nessun dato è stato toccato. Riprova tra poco.");
      return;
    }
    try { await supabase.auth.signOut(); } catch {}
    try { Object.keys(localStorage).filter((k) => k.startsWith("vl2.")).forEach((k) => localStorage.removeItem(k)); } catch {}
    window.location.href = "/accedi?account=eliminato";
  }

  return (
    <section className="dati" aria-labelledby="dati-titolo">
      <h2 id="dati-titolo">I tuoi dati</h2>
      <p className="hint">
        Puoi scaricare in qualsiasi momento tutto quello che Valigia Leggera conserva su di te: email, profilo,
        viaggi salvati e salvadanaio.
      </p>
      <button type="button" className="btn btn-secondario" onClick={scarica} disabled={stato === "scarico"}>
        {stato === "scarico" ? "Preparo il file…" : "Scarica i miei dati"}
      </button>

      {stato !== "conferma" && stato !== "elimino" ? (
        <p className="hint" style={{ marginTop: 18 }}>
          <button type="button" className="link-button danger" onClick={() => { setStato("conferma"); setTesto(""); setErrore(""); }}>
            Elimina il mio account
          </button>
        </p>
      ) : (
        <div className="conferma" role="group" aria-labelledby="conferma-titolo">
          <p id="conferma-titolo">
            <strong>Vuoi davvero eliminare l&apos;account {email}?</strong> Verranno cancellati per sempre il profilo,
            tutti i viaggi salvati e il salvadanaio. Non si può annullare. Se vuoi conservarli, scarica prima i tuoi dati.
          </p>
          <label htmlFor="conferma-testo">Per confermare scrivi {PAROLA}</label>
          <input id="conferma-testo" type="text" autoComplete="off" value={testo} onChange={(e) => setTesto(e.target.value)} />
          <div className="conferma-azioni">
            <button type="button" className="btn btn-pericolo" onClick={elimina} disabled={testo.trim().toUpperCase() !== PAROLA || stato === "elimino"}>
              {stato === "elimino" ? "Elimino…" : "Elimina definitivamente"}
            </button>
            <button type="button" className="link-button" onClick={() => { setStato("idle"); setTesto(""); setErrore(""); }} disabled={stato === "elimino"}>
              Annulla
            </button>
          </div>
        </div>
      )}
      {errore && <p className="alert" role="alert">{errore}</p>}
    </section>
  );
}

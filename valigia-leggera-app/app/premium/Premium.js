"use client";
import { useState } from "react";
import Link from "next/link";
import s from "@/components/viaggi.module.css";
import { createClient } from "@/lib/supabase/client";
import { evento } from "@/lib/statistiche";

// Prezzi previsti: da confermare quando si attivano i pagamenti
const OFFERTE = [
  { id: "pacchetto", nome: "Pacchetto", prezzo: "2,99 €", sotto: "una volta sola", punti: ["15 itinerari su misura", "Non scade", "Ideale per un viaggio da organizzare"] },
  { id: "annuale", nome: "Annuale", prezzo: "9,99 €", sotto: "all'anno", punti: ["Itinerari su misura senza limite", "Tutti i temi, anche combinati", "Ideale se viaggi spesso"] },
];

export default function Premium({ loggedIn, premium, richiestaIniziale, usati, gratuiti }) {
  const [richiesta, setRichiesta] = useState(richiestaIniziale);
  const [stato, setStato] = useState("pronto"); // pronto | busy | errore

  async function scegli(offerta) {
    setStato("busy");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setStato("errore"); return; }
    const { error } = await supabase.from("premium_richieste").upsert({ user_id: user.id, offerta, updated_at: new Date().toISOString() });
    if (error) { setStato("errore"); return; }
    setRichiesta(offerta); setStato("pronto");
    evento("premium-richiesta-" + offerta, "Richiesta premium: " + offerta);
  }
  async function ritira() {
    setStato("busy");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = user ? await supabase.from("premium_richieste").delete().eq("user_id", user.id) : { error: true };
    if (error) { setStato("errore"); return; }
    setRichiesta(null); setStato("pronto");
  }

  if (premium) {
    return <div className={s.pigbox}><h2>Sei già premium</h2><p className={s.fine}>Puoi creare itinerari su misura senza il limite dei {gratuiti} gratuiti.</p><Link className={`${s.btn} ${s.pigCta}`} href="/">Cerca un viaggio</Link></div>;
  }

  return (
    <>
      {loggedIn && <p className={s.fine}>Hai usato {Math.min(usati, gratuiti)} itinerari gratuiti su {gratuiti}.</p>}
      <div className={s.offerte}>
        {OFFERTE.map((o) => (
          <section key={o.id} className={`${s.offerta} ${richiesta === o.id ? s.scelta : ""}`} aria-labelledby={"off-" + o.id}>
            <h2 id={"off-" + o.id}>{o.nome}</h2>
            <p className={s.prezzo}>{o.prezzo}<small> {o.sotto}</small></p>
            <ul>{o.punti.map((x) => <li key={x}>{x}</li>)}</ul>
            {!loggedIn ? (
              <Link className={`${s.btn} ${s.pigCta}`} href="/accedi?next=/premium">Accedi per sceglierlo</Link>
            ) : richiesta === o.id ? (
              <p className={`${s.status} ${s.ok}`}>Richiesta registrata: ti scriviamo appena è attivo.</p>
            ) : (
              <button type="button" className={`${s.btn} ${s.pigCta}`} onClick={() => scegli(o.id)} disabled={stato === "busy"}>
                {richiesta ? "Preferisco questo" : "Lo voglio: avvisami quando è attivo"}
              </button>
            )}
          </section>
        ))}
      </div>
      {richiesta && <p className={s.fine}>Hai cambiato idea? <button type="button" className={s.linkBtn} onClick={ritira} disabled={stato === "busy"}>Ritira la richiesta</button></p>}
      {stato === "errore" && <p className={`${s.status} ${s.no}`}>Non è andata a buon fine. Ricarica la pagina e riprova.</p>}
      <p className={s.fine}>
        I pagamenti non sono ancora attivi: lasciando la richiesta non paghi nulla e non ti impegni a nulla. Quando il premium sarà
        disponibile ti scriveremo all&apos;indirizzo del tuo account, con il prezzo definitivo. I prezzi qui indicati sono quelli previsti.
      </p>
    </>
  );
}

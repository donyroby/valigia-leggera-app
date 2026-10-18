"use client";
// Itinerario su misura scritto da Claude: temi, creazione con avanzamento, risultato con link alle mappe.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { evento } from "@/lib/statistiche";
import s from "@/components/viaggi.module.css";
import { TEMI_SCELTA, ETICHETTA_PULSANTE, GRATUITI, chiaveItinerario, temiValidi, etaBambini } from "@/lib/itinerari/temi";

const mapsUrl = (name, city) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(name + ", " + city);
const ERRORI = {
  accedi: "Per creare un itinerario su misura devi prima accedere.",
  salvataggio: "L'itinerario è pronto ma non sono riuscito a salvarlo. Riprova tra poco.",
  limite: `Hai già usato i tuoi ${GRATUITI} itinerari gratuiti.`,
  troppi: "Hai creato molti itinerari oggi: riprova domani.",
  non_attivo: "Gli itinerari su misura non sono ancora attivi. Riprova più tardi.",
  occupato: "Claude è molto richiesto in questo momento: riprova tra qualche minuto.",
  credito: "Il servizio non è disponibile in questo momento: riprova più tardi.",
  interrotto: "La creazione si è interrotta. Riprova: non ti è stato conteggiato.",
  lettura: "Non sono riuscito a leggere l'itinerario. Riprova: non ti è stato conteggiato.",
  tempo: "Ci sta mettendo più del previsto. Ricarica la pagina tra qualche minuto: se l'itinerario è pronto lo trovi qui.",
  lungo: "L'itinerario è venuto troppo lungo. Riprova: non ti è stato conteggiato.",
};
// Il codice tra parentesi aiuta a capire il problema se qualcuno lo segnala
const errore = (c) => ERRORI[c] || `Qualcosa è andato storto. Riprova tra poco.${c ? ` (codice: ${c})` : ""}`;

// Frase "perché andarci" + piatto da provare, con la punteggiatura giusta
const descrizione = (a) => {
  const w = (a.what || "").trim();
  if (!a.dish) return w;
  return (w && !/[.!?…]$/.test(w) ? w + "." : w) + (w ? " " : "") + `Da provare: ${a.dish}.`;
};

function Giorni({ days, destName }) {
  return days.map((g, i) => (
    <div key={i} className={s.day}>
      <h3>{g.title}</h3>
      <ul>
        {g.items.map((a, j) => (
          <li key={j}>
            <span>
              <b>{a.slot}</b><a className={s.map} href={mapsUrl(a.name, destName)} target="_blank" rel="noopener noreferrer">{a.name}</a>
              {a.area && <small> ({a.area})</small>}
              {(a.what || a.dish) && <><br /><small>{descrizione(a)}</small></>}
            </span>
            <span>{a.cost === 0 ? "gratis" : typeof a.cost === "number" ? `~${a.cost} € a persona` : ""}</span>
          </li>
        ))}
      </ul>
      {g.tip && <p className={s.hint}>{g.tip}</p>}
    </div>
  ));
}

export default function ItinerarioClaude({ destId, destName, qs, p, loggedIn, loginHref, salvati, usatiIniziali, premium, esempio }) {
  const [temi, setTemi] = useState(["classico"]);
  const [mappa, setMappa] = useState(() => Object.fromEntries((salvati || []).map((x) => [x.chiave, x.dati])));
  const [usati, setUsati] = useState(usatiIniziali || 0);
  const [stato, setStato] = useState({ fase: "pronto" }); // pronto | carico | errore
  const ctl = useRef(null);
  const [sec, setSec] = useState(0);

  const chiave = chiaveItinerario(destId, p, temi);
  const dati = mappa[chiave];
  const restanti = premium ? null : Math.max(0, GRATUITI - usati);
  const kids = etaBambini(p);

  useEffect(() => {
    if (stato.fase !== "carico") return;
    const t0 = Date.now(), id = setInterval(() => setSec(Math.round((Date.now() - t0) / 1000)), 1000);
    return () => clearInterval(id);
  }, [stato.fase]);

  const tocca = (k) => {
    if (stato.fase === "carico") return;
    setStato({ fase: "pronto" });
    setTemi((t) => {
      if (t.includes(k)) return t.length > 1 ? t.filter((x) => x !== k) : t;
      return temiValidi(t.length >= 2 ? [t[1], k] : [...t, k]);
    });
  };

  // 1) il sito controlla e prepara il lavoro; 2) la funzione in background lo esegue; 3) si chiede ogni 3 s se è pronto
  async function crea(rigenera) {
    ctl.current = new AbortController();
    const signal = ctl.current.signal;
    setSec(0);
    setStato({ fase: "carico" });
    const finito = (j) => {
      if (!j.giaPronto) evento(rigenera ? "itinerario-rigenerato" : "itinerario-creato", `Itinerario ${rigenera ? "rigenerato" : "creato"} (${temi.join("+")}${kids.length ? ", con bambini" : ""})`);
      setMappa((m) => ({ ...m, [chiave]: j.dati }));
      if (typeof j.usati === "number") setUsati(j.usati);
      setStato({ fase: "pronto" });
    };
    try {
      const res = await fetch("/api/itinerario", {
        method: "POST", signal, headers: { "content-type": "application/json" },
        body: JSON.stringify({ destId, qs, temi, rigenera }),
      });
      const j = await res.json().catch(() => ({ codice: `http_${res.status}` }));
      if (j.dati) return finito(j);
      if (!j.lavoro) {
        if (j.codice === "limite") evento("itinerario-limite", "Limite gratuito raggiunto");
        return setStato({ fase: "errore", msg: errore(j.codice || `http_${res.status}`), codice: j.codice });
      }

      const av = await fetch("/.netlify/functions/itinerario-background", {
        method: "POST", signal, headers: { "content-type": "application/json" }, body: JSON.stringify(j.avvio),
      });
      if (!av.ok) return setStato({ fase: "errore", msg: errore(`avvio_${av.status}`) });

      const t0 = Date.now();
      while (Date.now() - t0 < 200000) {
        await new Promise((r, no) => { const t = setTimeout(r, 3000); signal.addEventListener("abort", () => { clearTimeout(t); no(new DOMException("", "AbortError")); }, { once: true }); });
        const r = await fetch(`/api/itinerario?lavoro=${j.lavoro}`, { signal, cache: "no-store" });
        const st = await r.json().catch(() => ({}));
        if (st.stato === "ok" && st.dati) return finito(st);
        if (st.stato === "errore") return setStato({ fase: "errore", msg: errore(st.codice) });
        if (st.parziale?.length) setStato({ fase: "carico", parziale: st.parziale });
      }
      setStato({ fase: "errore", msg: errore("tempo") });
    } catch (e) {
      if (e?.name === "AbortError") { setStato({ fase: "pronto" }); return; }
      setStato({ fase: "errore", msg: errore("connessione") });
    }
  }

  const etaTxt = kids.map((x) => (x < 1 ? "meno di 1 anno" : x + (x === 1 ? " anno" : " anni"))).join(", ");
  const stella = <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0l1.8 5.2L15 7l-5.2 1.8L8 14l-1.8-5.2L1 7l5.2-1.8z" /></svg>;

  const chips = (
    <div className={s.chips} role="group" aria-label="Tipo di itinerario">
      {TEMI_SCELTA.map(([k, l]) => (
        <button key={k} type="button" className={s.chip} aria-pressed={temi.includes(k)} onClick={() => tocca(k)} disabled={stato.fase === "carico"}>{l}</button>
      ))}
    </div>
  );
  const bambini = kids.length > 0 && (
    <p className={s.aiFixed}>
      <b>✓ Adatto {kids.length === 1 ? `a un bambino di ${etaTxt}` : `ai bambini (${etaTxt})`}</b>
      <span>Sempre incluso: scegli liberamente fino a due temi.</span>
    </p>
  );
  const linkPremium = <Link href="/premium">Scopri il premium</Link>;
  const errBox = stato.fase === "errore" && <p className={s.aiErr} role="alert">{stato.msg}{stato.codice === "limite" && <> {linkPremium}</>}</p>;
  const meta = (
    <div className={s.aiMeta}>
      <span>Pronto in circa 20 secondi</span>
      {loggedIn && (premium ? <span>Account premium</span> : <span>{restanti} gratuiti su {GRATUITI} · <Link href="/premium">Premium</Link></span>)}
    </div>
  );

  let azione;
  if (stato.fase === "carico") {
    const msg = sec < 8 ? `Sto pensando ai luoghi giusti a ${destName}…` : sec < 45 ? "Sto scrivendo l'itinerario…" : "Ci sto mettendo più del solito, ma sto ancora lavorando…";
    const pronti = stato.parziale?.length || 0;
    azione = (
      <>
        {pronti > 0 && (
          <div className={s.aiResult}>
            <p className={s.fine} style={{ marginTop: 0 }}>Ecco i primi giorni: gli altri arrivano tra poco.</p>
            <Giorni days={stato.parziale} destName={destName} />
          </div>
        )}
        <p role="status">{pronti > 0 ? "Sto scrivendo il resto dell'itinerario…" : msg} · {sec} s</p>
        <button type="button" className={`${s.btn} ${s.aiGhost}`} onClick={() => ctl.current?.abort()}>Annulla</button>
      </>
    );
  } else if (!loggedIn) {
    azione = (
      <>
        <Link className={`${s.btn} ${s.aiCta}`} href={loginHref}>Accedi per creare il tuo itinerario</Link>
        <p>Con l&apos;account hai {GRATUITI} itinerari su misura gratuiti.</p>
      </>
    );
  } else if (!dati && restanti === 0) {
    azione = <p className={s.aiErr}>{ERRORI.limite} {linkPremium}: con il premium ne crei quanti ne vuoi.</p>;
  } else if (!dati) {
    const lab = temi.length === 1 ? ETICHETTA_PULSANTE[temi[0]] : "Crea itinerario combinato";
    azione = (
      <>
        {errBox}
        <button type="button" className={`${s.btn} ${s.aiCta}`} onClick={() => crea(false)}>{lab}</button>
        {meta}
      </>
    );
  }

  const risultato = dati && stato.fase !== "carico" && (
    <>
      <div className={s.aiResult}>
        <p className={s.fine} style={{ marginTop: 0 }}>Ogni tappa ha il link alla mappa: prima di partire verifica orari, aperture e prezzi.</p>
        <Giorni days={dati.days} destName={destName} />
        {dati.food?.length > 0 && (
          <div className={s.day}>
            <h3>Da assaggiare</h3>
            <ul>
              {dati.food.map((f, j) => (
                <li key={j}><span><a className={s.map} href={mapsUrl(f.name, destName)} target="_blank" rel="noopener noreferrer">{f.name}</a><br /><small>{f.what}</small></span><span></span></li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {loggedIn && (restanti === null || restanti > 0) && (
        <>
          {errBox}
          <button type="button" className={`${s.btn} ${s.aiGhost}`} onClick={() => crea(true)}>Rigenera itinerario</button>
          <p>Rigenerare usa un nuovo itinerario{restanti != null ? `: te ne ${restanti === 1 ? "resta 1" : `restano ${restanti}`} su ${GRATUITI}` : ""}.</p>
        </>
      )}
    </>
  );

  return (
    <section className={s.aibox} aria-labelledby="ai-titolo">
      <span className={s.aiKicker}>{stella}Scritto con l&apos;AI per te</span>
      <h2 id="ai-titolo">Il tuo itinerario su misura a {destName}</h2>
      <p>Luoghi veri, giorno per giorno, adatti a chi viaggia e alla stagione. Scegli fino a due temi.</p>
      {chips}
      {bambini}
      {risultato || azione}
      {!dati && esempio && (
        <details className={s.aiSample}>
          <summary>Vedi un esempio di itinerario</summary>
          <div className={s.aiResult}>{esempio}</div>
        </details>
      )}
    </section>
  );
}

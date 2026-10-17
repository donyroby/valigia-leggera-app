"use client";
// Itinerario su misura scritto da Claude: temi, creazione con avanzamento, risultato con link alle mappe.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import s from "@/components/viaggi.module.css";
import { TEMI, ETICHETTA_PULSANTE, GRATUITI, chiaveItinerario, temiValidi } from "@/lib/itinerari/temi";

const mapsUrl = (name, city) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(name + ", " + city);
const ERRORI = {
  accedi: "Per creare un itinerario su misura devi prima accedere.",
  limite: `Hai già usato i tuoi ${GRATUITI} itinerari gratuiti. Presto arriverà la versione premium per crearne altri.`,
  troppi: "Hai creato molti itinerari oggi: riprova domani.",
  non_attivo: "Gli itinerari su misura non sono ancora attivi. Riprova più tardi.",
  occupato: "Claude è molto richiesto in questo momento: riprova tra qualche minuto.",
  credito: "Il servizio non è disponibile in questo momento: riprova più tardi.",
  interrotto: "La creazione si è interrotta. Riprova: non ti è stato conteggiato.",
  lettura: "Non sono riuscito a leggere l'itinerario. Riprova: non ti è stato conteggiato.",
  tempo: "Claude ci ha messo troppo questa volta. Riprova: non ti è stato conteggiato.",
  lungo: "L'itinerario è venuto troppo lungo. Riprova: non ti è stato conteggiato.",
};
// Il codice tra parentesi aiuta a capire il problema se qualcuno lo segnala
const errore = (c) => ERRORI[c] || `Qualcosa è andato storto. Riprova tra poco.${c ? ` (codice: ${c})` : ""}`;

export default function ItinerarioClaude({ destId, destName, qs, p, loggedIn, loginHref, salvati, usatiIniziali, premium }) {
  const [temi, setTemi] = useState(["classico"]);
  const [mappa, setMappa] = useState(() => Object.fromEntries((salvati || []).map((x) => [x.chiave, x.dati])));
  const [usati, setUsati] = useState(usatiIniziali || 0);
  const [stato, setStato] = useState({ fase: "pronto" }); // pronto | carico | errore
  const ctl = useRef(null);
  const [sec, setSec] = useState(0);

  const chiave = chiaveItinerario(destId, p, temi);
  const dati = mappa[chiave];
  const restanti = premium ? null : Math.max(0, GRATUITI - usati);

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

  async function crea(rigenera) {
    ctl.current = new AbortController();
    setSec(0);
    setStato({ fase: "carico" });
    try {
      const res = await fetch("/api/itinerario", {
        method: "POST", signal: ctl.current.signal, headers: { "content-type": "application/json" },
        body: JSON.stringify({ destId, qs, temi, rigenera }),
      });
      const j = await res.json().catch(() => ({ codice: `http_${res.status}` }));
      if (j.dati) {
        setMappa((m) => ({ ...m, [chiave]: j.dati }));
        if (typeof j.usati === "number") setUsati(j.usati);
        setStato({ fase: "pronto" });
      } else setStato({ fase: "errore", msg: errore(j.codice || `http_${res.status}`) });
    } catch (e) {
      if (e?.name === "AbortError") { setStato({ fase: "pronto" }); return; }
      setStato({ fase: "errore", msg: errore("connessione") });
    }
  }

  const chips = (
    <div className={s.chips} role="group" aria-label="Tipo di itinerario">
      {TEMI.map(([k, l]) => (
        <button key={k} type="button" className={s.chip} aria-pressed={temi.includes(k)} onClick={() => tocca(k)} disabled={stato.fase === "carico"}>{l}</button>
      ))}
    </div>
  );

  let azione;
  if (stato.fase === "carico") {
    const msg = sec < 8 ? `Sto pensando ai luoghi giusti a ${destName}…` : sec < 25 ? "Sto scrivendo l'itinerario…" : "Ci sto mettendo più del solito, ma sto ancora lavorando…";
    azione = (
      <div className={s.genbox}>
        <p className={s.fine} role="status">{msg} · {sec} s</p>
        <button type="button" className={`${s.btn} ${s.ghost}`} onClick={() => ctl.current?.abort()}>Annulla</button>
      </div>
    );
  } else if (!loggedIn) {
    azione = (
      <div className={s.genbox}>
        <Link className={`${s.btn} ${s.sun}`} href={loginHref}>Accedi per creare il tuo itinerario</Link>
        <p className={s.fine}>Con l&apos;account hai {GRATUITI} itinerari su misura gratuiti.</p>
      </div>
    );
  } else if (!dati && restanti === 0) {
    azione = <div className={s.genbox}><p className={`${s.status} ${s.no}`}>{ERRORI.limite}</p></div>;
  } else if (!dati) {
    const lab = temi.length === 1 ? ETICHETTA_PULSANTE[temi[0]] : "Crea itinerario combinato";
    azione = (
      <div className={s.genbox}>
        {stato.fase === "errore" && <p className={`${s.status} ${s.no}`}>{stato.msg}</p>}
        <button type="button" className={`${s.btn} ${s.sun}`} onClick={() => crea(false)}>{lab}</button>
        <p className={s.fine}>
          Claude sceglie luoghi reali della città, adatti al tuo profilo, alla durata e alla stagione, con il link alla mappa per verificarli.
          Di solito servono 20-40 secondi.
          {restanti != null && ` Ti ${restanti === 1 ? "resta 1 itinerario gratuito" : `restano ${restanti} itinerari gratuiti`} su ${GRATUITI}.`}
        </p>
      </div>
    );
  }

  return (
    <section>
      <h2 className={s.h}>Itinerario su misura</h2>
      <p className={s.fine}>Scegli il tipo di viaggio: puoi combinare fino a due temi.</p>
      {chips}
      {dati && stato.fase !== "carico" ? (
        <>
          <p className={s.fine}>Itinerario creato da Claude per {destName}. Ogni tappa ha il link alla mappa: prima di partire verifica orari, aperture e prezzi.</p>
          {dati.days.map((g, i) => (
            <div key={i} className={s.day}>
              <h3>{g.title}</h3>
              <ul>
                {g.items.map((a, j) => (
                  <li key={j}>
                    <span>
                      <b>{a.slot}</b><a className={s.map} href={mapsUrl(a.name, destName)} target="_blank" rel="noopener noreferrer">{a.name}</a>
                      {a.area && <small> ({a.area})</small>}
                      {(a.what || a.dish) && <><br /><small>{a.what}{a.dish ? ` Da provare: ${a.dish}.` : ""}</small></>}
                    </span>
                    <span>{a.cost === 0 ? "gratis" : typeof a.cost === "number" ? `~${a.cost} € a persona` : ""}</span>
                  </li>
                ))}
              </ul>
              {g.tip && <p className={s.hint}>{g.tip}</p>}
            </div>
          ))}
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
          {loggedIn && (restanti === null || restanti > 0) && (
            <div className={s.genbox}>
              {stato.fase === "errore" && <p className={`${s.status} ${s.no}`}>{stato.msg}</p>}
              <button type="button" className={`${s.btn} ${s.ghost}`} onClick={() => crea(true)}>Rigenera itinerario</button>
              <p className={s.fine}>Rigenerare usa un nuovo itinerario{restanti != null ? `: te ne ${restanti === 1 ? "resta 1" : `restano ${restanti}`} su ${GRATUITI}` : ""}.</p>
            </div>
          )}
        </>
      ) : azione}
    </section>
  );
}

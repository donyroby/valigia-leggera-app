"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import s from "@/components/viaggi.module.css";
import { fmt, fmtD } from "@/lib/viaggi/calcoli";

const ZONE = [["tutte", "Tutte"], ["italia", "Italia"], ["europa", "Europa"], ["mondo", "Mondo"]];

export default function Offerte({ da, aeroporti, nomePartenza, offerte, errore, senzaToken }) {
  const router = useRouter();
  const [zona, setZona] = useState("tutte");
  const lista = offerte.filter((o) => zona === "tutte" || o.zona === zona).slice(0, 30);
  const scali = (n) => (n == null ? null : n === 0 ? "diretto" : n === 1 ? "1 scalo" : n + " scali");

  return (
    <>
      <div className={s.lcToolbar}>
        <div className={s.field}>
          <label htmlFor="da">Parti da</label>
          <select id="da" value={da} onChange={(e) => router.push(`/offerte?da=${e.target.value}`)}>
            {aeroporti.map((a) => <option key={a.id} value={a.id}>{a.nome} ({a.id})</option>)}
          </select>
        </div>
      </div>
      <div className={s.chips} role="group" aria-label="Filtra le offerte">
        {ZONE.map(([k, l]) => (
          <button key={k} type="button" className={s.chip} aria-pressed={zona === k} onClick={() => setZona(k)}>{l}</button>
        ))}
      </div>

      {senzaToken || errore ? (
        <div className={s.empty}>
          <strong>Le offerte non sono disponibili in questo momento.</strong><br />
          Riprova tra poco. Intanto puoi cercare una meta o guardare le idee low cost.
        </div>
      ) : lista.length === 0 ? (
        <div className={s.empty}>
          <strong>Nessuna offerta trovata da {nomePartenza}{zona !== "tutte" ? " per questa zona" : ""}.</strong><br />
          Prova un altro aeroporto di partenza o un&apos;altra zona.
        </div>
      ) : (
        <div className={s.offerte}>
          {lista.map((o) => (
            <article key={o.id} className={s.offerta}>
              <div className={s.offertaTop}>
                <h2>{o.nome}</h2>
                <span className={s.tag}>{o.paese}</span>
              </div>
              <p className={s.price}>{fmt(o.prezzo)}<small> a persona, a/r</small></p>
              <p className={s.offertaInfo}>
                {fmtD(o.andata)} - {fmtD(o.ritorno)} · {o.notti} notti
                {[o.compagnia, scali(o.scali)].filter(Boolean).length > 0 && <><br />{[o.compagnia, scali(o.scali)].filter(Boolean).join(" · ")}</>}
              </p>
              <div className={s.qlinks}>
                <a className={`${s.btn} ${s.sun} ${s.sm}`} href={o.linkVolo} target="_blank" rel="noopener noreferrer sponsored">Vedi il volo</a>
                <Link className={`${s.btn} ${s.ghost} ${s.sm}`} href={o.linkViaggio}>Calcola il viaggio</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

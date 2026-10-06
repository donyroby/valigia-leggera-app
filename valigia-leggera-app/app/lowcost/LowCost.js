"use client";

import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer";
import Link from "next/link";
import s from "@/components/viaggi.module.css";
import TopBar from "@/components/TopBar";
import { DEPS } from "@/lib/viaggi/dati";
import { fmt, repDate } from "@/lib/viaggi/calcoli";
import { statoIniziale, sistemaStato } from "@/lib/viaggi/ricerca";
import { versoIndirizzo } from "@/lib/viaggi/parametri";
import { MESI, SAVE_TIPS, NOTTI_LC, CAP_LC, contList, piuEconomica, ideeDate } from "@/lib/viaggi/lowcost";

const KEY = "vl2.lowcost";
const GRUPPI = [["italia", "In Italia", "in Italia", 4], ["europa", "In Europa", "in Europa", 4], ["mondo", "Nel mondo", "nel mondo", 3]];

export default function LowCost() {
  const [base, setBase] = useState(null);
  const [lc, setLc] = useState(null);

  useEffect(() => {
    let st = null, saved = null;
    try { st = JSON.parse(localStorage.getItem("vl2.cerca") || "null"); } catch {}
    try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch {}
    setBase(sistemaStato(st || statoIniziale()));
    const month = new Date().getMonth() + 1;
    setLc({
      month: saved && saved.month >= 1 && saved.month <= 12 ? saved.month : month,
      nights: saved && NOTTI_LC.includes(saved.nights) ? saved.nights : 2,
      cap: saved && CAP_LC.includes(saved.cap) ? saved.cap : 200,
    });
  }, []);

  useEffect(() => { if (lc) try { localStorage.setItem(KEY, JSON.stringify(lc)); } catch {} }, [lc]);

  const dati = useMemo(() => {
    if (!base || !lc) return null;
    const date = repDate(lc.month, lc.nights);
    return {
      date,
      gruppi: GRUPPI.map(([cont, titolo, label, limit]) => {
        const list = contList(cont, lc.cap, date, lc.nights, limit, base, lc.month);
        return { cont, titolo, label, list, cheapest: list.length ? null : piuEconomica(cont, date, lc.nights, base) };
      }),
      idee: ideeDate(base, lc.nights, lc.cap),
    };
  }, [base, lc]);

  if (!dati) return <div className={s.page} aria-busy="true" />;

  const dep = DEPS.find((x) => x.id === base.from);
  const upd = (patch) => setLc((cur) => ({ ...cur, ...patch }));
  const href = (r) => `/meta/${r.d.id}?${versoIndirizzo(r.p)}`;
  const nomeMese = MESI[lc.month - 1];

  return (
    <div className={s.page} data-profile={base.profile}>
      <TopBar />
      <div className={s.summary}>
        <h1 className={s.pageTitle}>Idee low cost</h1>
        <span>Da {dep.n} · {base.people} {base.people === 1 ? "persona" : "persone"} · <Link href="/">cambia nella ricerca</Link></span>
      </div>

      <div className={s.lcToolbar}>
        <div className={s.field}>
          <label htmlFor="lcMonth">Mese</label>
          <select id="lcMonth" value={lc.month} onChange={(e) => upd({ month: +e.target.value })}>
            {MESI.map((m, i) => <option key={m} value={i + 1}>{m[0].toUpperCase() + m.slice(1)}</option>)}
          </select>
        </div>
        <div className={s.field}>
          <label htmlFor="lcNights">Durata</label>
          <select id="lcNights" value={lc.nights} onChange={(e) => upd({ nights: +e.target.value })}>
            {NOTTI_LC.map((v) => <option key={v} value={v}>{v} notti</option>)}
          </select>
        </div>
        <div className={s.field}>
          <label htmlFor="lcCap">Budget massimo</label>
          <select id="lcCap" value={lc.cap} onChange={(e) => upd({ cap: +e.target.value })}>
            {CAP_LC.map((v) => <option key={v} value={v}>Sotto {v} €</option>)}
          </select>
        </div>
      </div>

      <h2 className={s.sectionTitle}>La proposta del mese: {nomeMese}, sotto {lc.cap} € a persona</h2>
      {dati.gruppi.map((g) => (
        <section key={g.cont} className={s.lcGroup}>
          <h3>{g.titolo}</h3>
          {g.list.length ? (
            <div className={s.mscroll}>
              {g.list.map(({ r, reason, badge }) => (
                <Link key={r.d.id} className={s.mtile} href={href(r)}>
                  {badge && <span className={s.mbadge}>{badge}</span>}
                  <span className={s.mname}>{r.d.name}</span>
                  <span className={s.cc}>{r.d.cc} · {r.p.nights} notti</span>
                  <span className={s.price}>{fmt(r.pp)}<small> /persona</small></span>
                  {reason && <span className={s.mnote}>{reason}</span>}
                </Link>
              ))}
            </div>
          ) : (
            <div className={s.mempty}>
              Nessuna meta {g.label} sotto {lc.cap} € per {nomeMese}.
              {g.cheapest && <> La più economica è {g.cheapest.d.name} a {fmt(g.cheapest.pp)}.</>}
            </div>
          )}
        </section>
      ))}
      <p className={s.fine}>
        Le mete extraeuropee usano una stima più approssimativa (voli lunghi, spesso con scalo) e lo stesso modello di stagionalità
        delle mete europee, che potrebbe non rispecchiare le stagioni dell&apos;altro emisfero o dei climi tropicali.
        Controlla sempre clima e documenti di viaggio prima di partire.
      </p>

      <h2 className={s.sectionTitle}>Idee per le date della tua ricerca</h2>
      <p className={s.fine} style={{ marginTop: 0 }}>
        Partenza {new Date(base.date + "T12:00:00").toLocaleDateString("it-IT", { day: "numeric", month: "long" })}, {lc.nights} notti, sotto {lc.cap} € a persona.
      </p>
      <div className={s.rows}>
        {dati.idee.ok.length ? dati.idee.ok.map((r) => (
          <div key={r.d.id} className={s.rowcard}>
            <div>
              <h3>{r.d.name}</h3>
              <small>{r.d.it ? "Italia" : r.d.cc} · {r.p.nights} notti · totale {fmt(r.total)} per {r.p.people}</small>
            </div>
            <div className={s.pp}>{fmt(r.pp)}<small>a persona</small></div>
            <div className={s.rowActions}><Link className={`${s.btn} ${s.ghost}`} href={href(r)}>Vedi dettagli</Link></div>
          </div>
        )) : (
          <div className={s.empty}>
            <strong>Nessuna idea sotto {lc.cap} € a persona.</strong><br />
            {dati.idee.cheapest && <>La più economica è {dati.idee.cheapest.d.name} a {fmt(dati.idee.cheapest.pp)}. </>}
            Prova un limite più alto, meno notti o un aeroporto diverso.
          </div>
        )}
      </div>

      <h2 className={s.sectionTitle}>Trucchi per spendere meno</h2>
      <div className={s.tips}>
        {SAVE_TIPS.map(([t, x]) => <div key={t} className={s.tip}><b>{t}</b><p>{x}</p></div>)}
      </div>
      <Footer />
    </div>
  );
}

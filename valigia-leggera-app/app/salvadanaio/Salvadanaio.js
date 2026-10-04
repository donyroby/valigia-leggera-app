"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import s from "@/components/viaggi.module.css";
import TopBar from "@/components/TopBar";
import { DEPS } from "@/lib/viaggi/dati";
import { fmt, todayISO } from "@/lib/viaggi/calcoli";
import { statoIniziale, sistemaStato } from "@/lib/viaggi/ricerca";
import { versoIndirizzo } from "@/lib/viaggi/parametri";
import { meteAdesso, obiettivo, obiettiviViaggi, lineaDelTempo, piggyDate, NOTTI_SALVADANAIO } from "@/lib/viaggi/salvadanaio";
import { createClient } from "@/lib/supabase/client";

const mesiTxt = (m) => "circa " + m + (m === 1 ? " mese" : " mesi") + " al ritmo scelto";

export default function Salvadanaio({ userId, initial, trips, defaultProfile }) {
  const [pig, setPig] = useState(initial);
  const [base, setBase] = useState(null);
  const [custom, setCustom] = useState("");
  const [targetText, setTargetText] = useState(initial.target ? String(initial.target) : "");
  const [save, setSave] = useState("idle"); // idle | saving | saved | error
  const [armed, setArmed] = useState(false);
  const first = useRef(true);

  // Partenza, profilo e persone: le ultime scelte della ricerca su questo dispositivo, altrimenti il profilo dell'account
  useEffect(() => {
    let st = null;
    try { st = JSON.parse(localStorage.getItem("vl2.cerca") || "null"); } catch {}
    setBase(sistemaStato(st || { ...statoIniziale(), ...(defaultProfile ? { profile: defaultProfile } : {}) }));
  }, [defaultProfile]);

  // Salvataggio nel database, poco dopo l'ultima modifica
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setSave("saving");
    const t = setTimeout(async () => {
      const { error } = await createClient().from("piggy_bank").upsert({
        user_id: userId, saved: pig.saved, monthly: pig.monthly, target: pig.target, updated_at: new Date().toISOString(),
      });
      setSave(error ? "error" : "saved");
    }, 600);
    return () => clearTimeout(t);
  }, [pig, userId]);

  const add = (n) => { const v = Math.round(n); if (v > 0) setPig((p) => ({ ...p, saved: p.saved + v })); };
  const total = Math.max(0, pig.saved);

  const calcoli = useMemo(() => {
    if (!base) return null;
    return {
      adesso: meteAdesso(total, base),
      obiettivo: obiettivo(pig.target, total, pig.monthly),
      viaggi: obiettiviViaggi(trips, total, pig.monthly),
      linea: pig.monthly > 0 ? lineaDelTempo(Math.max(0, pig.monthly), total, base) : null,
    };
  }, [base, total, pig.target, pig.monthly, trips]);

  if (!base || !calcoli) return <div className={s.page} aria-busy="true" />;

  const dep = DEPS.find((x) => x.id === base.from);
  const tileHref = (r, date) => `/meta/${r.d.id}?${versoIndirizzo({ ...base, date, nights: NOTTI_SALVADANAIO })}`;

  const azzera = () => {
    if (!armed) { setArmed(true); setTimeout(() => setArmed(false), 4000); return; }
    setArmed(false); setTargetText(""); setPig({ saved: 0, monthly: 0, target: 0 });
  };

  return (
    <div className={s.page} data-profile={base.profile}>
      <TopBar />
      <div className={s.summary}>
        <h1 className={s.pageTitle}>Il tuo salvadanaio viaggi</h1>
        <span>Da {dep?.n} · {save === "saving" ? "Salvataggio…" : save === "saved" ? "Salvato nel tuo account" : save === "error" ? "Non salvato: controlla la connessione" : "Salvato nel tuo account"}</span>
      </div>

      <section className={s.panel} aria-label="Il tuo salvadanaio">
        <div className={s.ptotal}>
          <span className={s.plabel}>Nel salvadanaio</span>
          <span className={s.pbig}>{fmt(total)}</span>
          <button type="button" className={`${s.btn} ${s.ghost} ${s.presetReset} ${armed ? s.armed : ""}`} onClick={azzera}>
            {armed ? "Sicuro? Tocca ancora" : "Azzera"}
          </button>
        </div>

        <div className={s.padd} role="group" aria-label="Aggiungi denaro">
          {[10, 20, 50].map((v) => <button key={v} type="button" className={s.chip} onClick={() => add(v)}>+{v} €</button>)}
          <form className={s.paddcustom} onSubmit={(e) => { e.preventDefault(); add(+custom); setCustom(""); }}>
            <input type="number" min="1" step="1" inputMode="numeric" placeholder="altra cifra" aria-label="Altra cifra da aggiungere" value={custom} onChange={(e) => setCustom(e.target.value)} />
            <button type="submit" className={`${s.btn} ${s.ghost}`}>Aggiungi</button>
          </form>
        </div>

        <div className={s.field} style={{ marginTop: 18 }}>
          <label htmlFor="target">Hai un obiettivo di risparmio preciso? (facoltativo)</label>
          <input
            id="target" type="number" min="0" step="10" inputMode="numeric" placeholder="es. 500" className={s.input}
            value={targetText}
            onChange={(e) => { setTargetText(e.target.value); setPig((p) => ({ ...p, target: Math.max(0, Math.round(+e.target.value || 0)) })); }}
          />
        </div>
        {calcoli.obiettivo && (
          <div className={`${s.pgoal} ${s.ptarget} ${calcoli.obiettivo.done ? s.done : ""}`}>
            <h3>Il tuo obiettivo<span>{fmt(pig.target)}</span></h3>
            <div className={s.pbar}><b style={{ width: calcoli.obiettivo.pct + "%" }} /></div>
            <p className={s.fine}>
              {fmt(total)} su {fmt(pig.target)}
              {calcoli.obiettivo.done ? " · Obiettivo raggiunto! 🎉" : ` · mancano ${fmt(calcoli.obiettivo.remain)}${calcoli.obiettivo.mesi ? ` · ${mesiTxt(calcoli.obiettivo.mesi)} (${calcoli.obiettivo.quando})` : ""}`}
            </p>
          </div>
        )}

        <div className={`${s.field} ${s.budget}`} style={{ marginTop: 20 }}>
          <label htmlFor="monthly">Quanto pensi di riuscire ad aggiungere ogni mese, in media (facoltativo, solo per la stima dei tempi)</label>
          <div className={s.row}>
            <input id="monthly" type="range" min="0" max="300" step="10" value={pig.monthly} onChange={(e) => setPig((p) => ({ ...p, monthly: +e.target.value }))} />
            <output htmlFor="monthly" className={pig.monthly ? "" : s.outputEmpty}>{pig.monthly ? fmt(pig.monthly) + "/mese" : "nessuna stima"}</output>
          </div>
        </div>
      </section>

      <h2 className={s.sectionTitle}>Cosa puoi permetterti adesso</h2>
      {total <= 0 ? (
        <div className={s.mempty}>Aggiungi qualcosa al salvadanaio per vedere qui le prime mete a portata di mano.</div>
      ) : calcoli.adesso.list.length ? (
        <div className={s.mscroll}>
          {calcoli.adesso.list.map((r) => (
            <Link key={r.d.id} className={s.mtile} href={tileHref(r, todayISO())}>
              <span className={s.mname}>{r.d.name}</span>
              <span className={s.cc}>{r.d.cc} · {NOTTI_SALVADANAIO} notti</span>
              <span className={s.price}>{fmt(r.pp)}<small> /persona</small></span>
            </Link>
          ))}
        </div>
      ) : (
        <div className={s.mempty}>Con {fmt(total)} non c&apos;è ancora nulla: alla più economica ({calcoli.adesso.cheapest?.d.name}) mancano circa {fmt((calcoli.adesso.cheapest?.pp || 0) - total)}.</div>
      )}

      <h2 className={s.sectionTitle}>I tuoi obiettivi</h2>
      {calcoli.viaggi.length === 0 ? (
        <div className={s.mempty}>
          Non hai ancora salvato nessun viaggio. <Link href="/cerca">Cerca una meta</Link>, apri &quot;Dettagli e itinerario&quot; e usa &quot;Salva viaggio&quot;:
          comparirà qui come obiettivo, con una barra che si riempie ogni volta che aggiungi denaro.
        </div>
      ) : (
        <div className={s.pgoals}>
          {calcoli.viaggi.map((g) => (
            <div key={g.id} className={`${s.pgoal} ${g.done ? s.done : ""}`}>
              <h3><Link href={`/meta/${g.d.id}?${versoIndirizzo(g.p)}`}>{g.d.name}</Link><span>{fmt(g.cost)} a persona</span></h3>
              <div className={s.pbar}><b style={{ width: g.pct + "%" }} /></div>
              <p className={s.fine}>
                {fmt(total)} su {fmt(g.cost)} · {g.done ? "Puoi già permettertelo!" : `${fmt(g.remain)} ancora da mettere via${g.mesi ? " · " + mesiTxt(g.mesi) : ""}`}
              </p>
              {!g.done && (
                <div className={s.padd} style={{ marginTop: 10 }}>
                  <button type="button" className={s.chip} onClick={() => add(10)}>+10 €</button>
                  <button type="button" className={s.chip} onClick={() => add(20)}>+20 €</button>
                  <button type="button" className={s.chip} onClick={() => add(g.remain)}>Completa (+{fmt(g.remain)})</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <h2 className={s.sectionTitle}>Cosa potrai permetterti, mese dopo mese</h2>
      {calcoli.linea ? (
        <div className={s.ptimeline}>
          {calcoli.linea.map((m, i) => (
            <div key={m.label} className={s.pmonth}>
              <span className={s.pm}>{m.label}<span className={s.psave}>{fmt(m.cum)} risparmiati</span></span>
              <span className={s.pdest}>
                {m.top.length
                  ? m.top.map((r, k) => (
                      <span key={r.d.id}>{k > 0 && ", "}<Link href={tileHref(r, piggyDate(i))}><b>{r.d.name}</b></Link> {fmt(r.pp)}</span>
                    ))
                  : m.cheapest ? `ti mancano circa ${fmt(m.cheapest.pp - m.cum)} per ${m.cheapest.d.name}` : ""}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className={s.mempty}>Imposta una cifra mensile qui sopra per vedere come cambia nel tempo quello che potrai permetterti.</div>
      )}

      <p className={s.fine}>
        &quot;Adesso&quot; usa i prezzi di oggi; la linea del tempo ipotizza che tu continui a mettere via la cifra mensile scelta.
        Mete e prezzi sono stime, non offerte reali, e valgono per una persona e un weekend breve ({NOTTI_SALVADANAIO} notti), con la partenza
        e il profilo dell&apos;ultima ricerca. Il salvadanaio è un promemoria: non muove denaro vero.
      </p>
    </div>
  );
}

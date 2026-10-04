"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import s from "@/components/viaggi.module.css";
import { DEPS, ALL } from "@/lib/viaggi/dati";
import { fmt, fmtD, seasonLabel, todayISO, addDays, daysBetween } from "@/lib/viaggi/calcoli";
import { DEFAULT_PEOPLE, FILTRI, statoIniziale, sistemaStato, scegliDestinazione, suggerimenti, cerca } from "@/lib/viaggi/ricerca";
import PassCard from "./PassCard";
import TopBar from "@/components/TopBar";
import { createClient } from "@/lib/supabase/client";

const KEY = "vl2.cerca";
const CITTA = ALL.slice().sort((a, b) => a.name.localeCompare(b.name, "it"));

export default function Cerca() {
  const [st, setSt] = useState(null);
  const [destText, setDestText] = useState("");
  const resultsRef = useRef(null);

  // Carica le ultime scelte da questo browser (solo comodità: la ricerca non viene salvata nel database)
  useEffect(() => {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch {}
    const init = sistemaStato(saved || statoIniziale());
    setSt(init);
    setDestText(init.dest === "tutte" ? "" : init.destQ || "");
    // Prima ricerca su questo dispositivo: parto dal profilo preferito dell'account, se c'è
    if (!saved) {
      (async () => {
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          const { data } = await supabase.from("profiles").select("default_profile").eq("id", user.id).maybeSingle();
          const pr = data?.default_profile;
          if (pr && pr !== init.profile) {
            setSt((cur) => sistemaStato({ ...cur, profile: pr, people: DEFAULT_PEOPLE[pr], kids: Math.min(cur.kids, DEFAULT_PEOPLE[pr] - 1) }));
          }
        } catch {}
      })();
    }
  }, []);

  useEffect(() => {
    if (!st) return;
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch {}
  }, [st]);

  const res = useMemo(() => (st ? cerca(st) : null), [st]);

  if (!st) return <div className={s.page} aria-busy="true" />;

  const upd = (patch) => setSt((cur) => sistemaStato({ ...cur, ...patch }));

  const setProfile = (profile) => {
    const people = DEFAULT_PEOPLE[profile];
    upd({ profile, people, kids: Math.min(st.kids, Math.max(0, people - 1)) });
  };
  const setDate = (v) => { if (v && v >= todayISO()) upd({ date: v, ret: addDays(v, st.nights || 3) }); };
  const setRet = (v) => { if (v && v > st.date && daysBetween(st.date, v) <= 30) upd({ ret: v }); };
  const commitDest = (text) => {
    const r = scegliDestinazione(text);
    setDestText(r.dest === "tutte" ? "" : r.destQ);
    upd(r);
  };
  const setKidAge = (i, age) => { const a = st.kidsAges.slice(); a[i] = age; upd({ kidsAges: a }); };

  const { chosen, notFound, inb, over, cheapest, titolo, dep } = res;

  // Il pulsante conferma quello che c'è scritto nella destinazione e porta ai risultati
  const vaiAiRisultati = (e) => {
    e.preventDefault();
    commitDest(destText);
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const etichettaCerca = destText.trim()
    ? "Calcola il viaggio"
    : inb.length ? `Mostra ${inb.length === 1 ? "la meta" : "le " + inb.length + " mete"} nel budget` : "Cerca";
  const card = (r, isOver) => <PassCard key={r.d.id} r={r} over={isOver} budget={st.budget} />;

  return (
    <div className={s.page} data-profile={st.profile}>
      <TopBar />

      <section className={s.hero}>
        <h1>Dove ti porta il tuo budget?</h1>
        <p>
          Scegli da dove parti, le date e quanto vuoi spendere a persona. Hai già una città in mente?
          Scrivila e vedi il costo del viaggio. Altrimenti lasciati ispirare dalle mete che stanno nel tuo budget.
        </p>
        <span className={s.demo}>Prezzi stimati, non ancora reali</span>
      </section>

      <form className={s.panel} aria-label="Parametri del viaggio" onSubmit={vaiAiRisultati}>
        <div className={s.seg} role="radiogroup" aria-label="Con chi viaggi">
          {[["amici", "Tra amici", "ostelli, low cost"], ["coppia", "In coppia", "hotel e B&B"], ["famiglia", "In famiglia", "appartamenti"]].map(([v, l, sm]) => (
            <label key={v}>
              <input type="radio" name="profile" value={v} checked={st.profile === v} onChange={() => setProfile(v)} />
              <span>{l}<small>{sm}</small></span>
            </label>
          ))}
        </div>
        <div className={s.fields}>
          <div className={s.field}>
            <label htmlFor="from">Parti da</label>
            <select id="from" value={st.from} onChange={(e) => upd({ from: e.target.value })}>
              {DEPS.map((d) => <option key={d.id} value={d.id}>{d.n} ({d.id})</option>)}
            </select>
          </div>
          <div className={s.field}>
            <label htmlFor="dest">Destinazione</label>
            <input
              type="search" id="dest" list="cityList" placeholder="Ovunque: proponimi mete" autoComplete="off"
              value={destText}
              onChange={(e) => { setDestText(e.target.value); if (!e.target.value) commitDest(""); }}
              onBlur={(e) => commitDest(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commitDest(e.currentTarget.value); requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })); } }}
            />
            <datalist id="cityList">
              {CITTA.map((d) => <option key={d.id} value={d.name}>{d.cc}</option>)}
            </datalist>
          </div>
          <div className={s.field}>
            <label htmlFor="date">Data di partenza</label>
            <input type="date" id="date" min={todayISO()} value={st.date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className={s.field}>
            <label htmlFor="ret">Data di ritorno</label>
            <input type="date" id="ret" min={addDays(st.date, 1)} max={addDays(st.date, 30)} value={st.ret} onChange={(e) => setRet(e.target.value)} />
            <small className={s.fine}>{st.nights} {st.nights === 1 ? "notte" : "notti"}</small>
          </div>
          <div className={s.field}>
            <label htmlFor="people">Persone</label>
            <select id="people" value={st.people} onChange={(e) => upd({ people: +e.target.value })}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((v) => <option key={v} value={v}>{v} {v === 1 ? "persona" : "persone"}</option>)}
            </select>
          </div>
          <div className={s.field}>
            <label htmlFor="kids">di cui bambini</label>
            <select id="kids" value={st.kids} onChange={(e) => upd({ kids: Math.min(+e.target.value, st.people - 1) })}>
              {[0, 1, 2, 3, 4].map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          {st.kids > 0 && (
            <div className={`${s.field} ${s.kidsages}`}>
              <span className={s.label}>Età dei bambini</span>
              <div className={s.row}>
                {st.kidsAges.map((a, i) => (
                  <select key={i} aria-label={`Età bambino ${i + 1}`} value={a} onChange={(e) => setKidAge(i, +e.target.value)}>
                    {Array.from({ length: 18 }, (_, y) => <option key={y} value={y}>{y} anni</option>)}
                  </select>
                ))}
              </div>
            </div>
          )}
          <div className={s.field}>
            <label htmlFor="tm">Come viaggi</label>
            <select id="tm" value={st.tm} onChange={(e) => upd({ tm: e.target.value })}>
              <option value="auto">Il più adatto</option>
              <option value="treno">Preferisco il treno</option>
              <option value="volo">Preferisco l&apos;aereo</option>
            </select>
          </div>
          <div className={`${s.field} ${s.budget}`}>
            <label htmlFor="budget">Budget a persona</label>
            <div className={s.row}>
              <input type="range" id="budget" min="80" max="1000" step="10" value={st.budget} onChange={(e) => upd({ budget: +e.target.value })} />
              <output htmlFor="budget">{fmt(st.budget)}</output>
            </div>
          </div>
          <div className={s.fcwrap}>
            <label className={s.check}>
              <input type="checkbox" checked={st.fc !== false} onChange={(e) => upd({ fc: e.target.checked })} />
              <span>Solo alloggi con cancellazione gratuita <small>(il filtro viene applicato sul sito di prenotazione)</small></span>
            </label>
          </div>
          <div className={s.searchRow}>
            <button type="submit" className={`${s.btn} ${s.sun} ${s.searchBtn}`}>{etichettaCerca}</button>
            <span className={s.searchHint}>I risultati si aggiornano anche mentre cambi le scelte.</span>
          </div>
        </div>
      </form>

      <main>
        <div className={s.chips} role="group" aria-label="Filtra le mete">
          {FILTRI.map(([k, l]) => (
            <button key={k} type="button" className={s.chip} aria-pressed={st.filter === k} onClick={() => upd({ filter: k })}>{l}</button>
          ))}
        </div>
        <div className={s.summary} ref={resultsRef}>
          <h2>{titolo}</h2>
          <span>
            Da {dep.n} · {fmtD(st.date)} - {fmtD(st.ret)} ({st.nights} {st.nights === 1 ? "notte" : "notti"}) · {seasonLabel(st.date)} · prezzi a persona
          </span>
        </div>

        <div className={s.stack} aria-live="polite">
          {notFound ? (
            <NonTrovata testo={st.destQ} onPick={(d) => commitDest(d.name)} />
          ) : chosen !== null ? (
            <>
              {chosen ? card(chosen, false) : (
                <div className={s.empty}><strong>Parti già da lì.</strong><br />Scegli una destinazione diversa dalla città di partenza.</div>
              )}
              {inb.length > 0 && <h3 className={s.sub}>Altre idee nello stesso budget</h3>}
              {inb.map((r) => card(r, false))}
            </>
          ) : inb.length ? (
            inb.map((r) => card(r, false))
          ) : (
            <div className={s.empty}>
              <strong>Con {fmt(st.budget)} a persona non c&apos;è una meta adatta per queste date.</strong><br />
              {cheapest && <>La più economica è {cheapest.d.name} a {fmt(cheapest.pp)} a persona. </>}
              Prova ad alzare il budget, a ridurre le notti o a scegliere un periodo di bassa stagione.
            </div>
          )}
        </div>

        {over.length > 0 && !notFound && (
          <details className={s.more}>
            <summary>Oltre il budget ({over.length})</summary>
            <div className={s.stack} style={{ marginTop: 12 }}>{over.map((r) => card(r, true))}</div>
          </details>
        )}

        <p className={s.fine}>
          Prezzi stimati in base alla distanza, alla stagione e al costo medio della vita, per confrontare le mete.
          I prezzi reali li trovi sui siti di prenotazione collegati.
        </p>
      </main>
    </div>
  );
}

function NonTrovata({ testo, onPick }) {
  const sug = suggerimenti(testo);
  return (
    <div className={s.empty}>
      <strong>Non conosco ancora &quot;{testo}&quot;.</strong><br />
      Per ora la ricerca copre {ALL.length} città in Italia, in Europa e nel mondo.
      {sug.length > 0 && (
        <div className={s.links}>
          {sug.map((d) => <button key={d.id} type="button" className={`${s.btn} ${s.ghost}`} onClick={() => onPick(d)}>{d.name}</button>)}
        </div>
      )}
    </div>
  );
}

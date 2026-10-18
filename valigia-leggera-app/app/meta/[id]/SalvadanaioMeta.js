"use client";
// Salvadanaio della singola meta: quanto mettere da parte ogni mese e quando ci si arriva.
// Due domande in una: "con X al mese quando ci arrivo?" e "per partire in quella data quanto devo mettere?".
import { useState } from "react";
import Link from "next/link";
import s from "@/components/viaggi.module.css";
import { createClient } from "@/lib/supabase/client";
import { ALL, MESI } from "@/lib/viaggi/dati";
import { fmt, fmtD } from "@/lib/viaggi/calcoli";
import { versoRiga } from "@/lib/viaggi/parametri";

// "a maggio 2027", "ad aprile 2027"
const aMeseAnno = (n) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + n); const m = MESI[d.getMonth()]; return (/^[aeiou]/.test(m) ? "ad " : "a ") + m + " " + d.getFullYear(); };
// Versamenti mensili possibili prima della partenza (almeno 1)
const mesiFinoA = (iso) => {
  const oggi = new Date(), t = new Date(iso + "T12:00:00");
  return Math.max(1, (t.getFullYear() - oggi.getFullYear()) * 12 + (t.getMonth() - oggi.getMonth()));
};
const tondo10 = (n) => Math.max(10, Math.ceil(n / 10) * 10);

export default function SalvadanaioMeta({ loggedIn, loginHref, destId, destName, params, pp, total, budget, piggy, savedId }) {
  const saved = Math.max(0, Number(piggy?.saved) || 0);
  const remain = Math.max(0, Math.round(pp - saved));
  const mesiData = mesiFinoA(params.date);
  const perData = remain > 0 ? tondo10(remain / mesiData) : 0;
  const [monthly, setMonthly] = useState(() => Number(piggy?.monthly) > 0 ? Number(piggy.monthly) : perData || 50);
  const [stato, setStato] = useState(savedId ? "fatto" : "pronto"); // pronto | busy | fatto | errore

  const pct = pp > 0 ? Math.min(100, Math.round((saved / pp) * 100)) : 0;
  const mesi = remain > 0 && monthly > 0 ? Math.max(1, Math.ceil(remain / monthly)) : 0;
  const inTempo = mesi > 0 && mesi <= mesiData;
  const max = Math.max(300, tondo10(perData * 1.6));

  async function metti() {
    setStato("busy");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setStato("errore"); return; }
    const d = ALL.find((x) => x.id === destId);
    let ok = true;
    if (!savedId) {
      const { data, error } = await supabase.from("saved_trips").insert({ ...versoRiga(d, params, pp, budget), user_id: user.id }).select("id").single();
      if (error) ok = false;
      else window.dispatchEvent(new CustomEvent("vl-viaggio-salvato", { detail: { id: data.id } }));
    }
    const { error: e2 } = await supabase.from("piggy_bank").upsert({
      user_id: user.id, saved, monthly, target: Number(piggy?.target) || 0, updated_at: new Date().toISOString(),
    });
    setStato(ok && !e2 ? "fatto" : "errore");
  }

  return (
    <section className={s.pigbox} aria-labelledby="pig-titolo">
      <div className={s.pigHead}>
        <div className={s.jar} aria-hidden="true"><span style={{ height: pct + "%" }} /></div>
        <div>
          <span className={s.pigKicker}>Il tuo salvadanaio</span>
          <h2 id="pig-titolo">
            {remain === 0 ? `Puoi già permetterti ${destName}`
              : mesi ? `Con ${fmt(monthly)} al mese ci arrivi ${aMeseAnno(mesi)}`
              : `Metti da parte per ${destName}`}
          </h2>
          <small>
            {loggedIn && saved > 0 ? `Hai già messo da parte ${fmt(saved)} su ${fmt(pp)} a persona` : `Il viaggio costa circa ${fmt(pp)} a persona (${fmt(total)} in tutto)`}
          </small>
        </div>
      </div>

      {remain > 0 && (
        <>
          <div className={`${s.field} ${s.budget}`}>
            <label htmlFor="pig-mese">Quanto metti da parte ogni mese, a persona</label>
            <div className={s.row}>
              <input id="pig-mese" type="range" min="10" max={max} step="10" value={Math.min(monthly, max)} onChange={(e) => { setMonthly(+e.target.value); if (stato === "fatto") setStato("pronto"); }} />
              <output htmlFor="pig-mese">{fmt(monthly)}/mese</output>
            </div>
          </div>
          <div className={s.pigLines}>
            <p>Per partire il <b>{fmtD(params.date)}</b> servono <b>{fmt(perData)} al mese</b>{mesiData > 1 ? ` per ${mesiData} mesi` : ", da mettere da parte subito"}.</p>
            <p className={`${s.status} ${inTempo ? s.ok : s.no}`}>
              {inTempo ? `Con ${fmt(monthly)} al mese arrivi in tempo per la partenza.` : `Con ${fmt(monthly)} al mese arrivi dopo la data scelta: aumenta la cifra o sposta il viaggio.`}
            </p>
          </div>
        </>
      )}

      {!loggedIn ? (
        <Link className={`${s.btn} ${s.pigCta}`} href={loginHref}>Accedi per mettere da parte per {destName}</Link>
      ) : stato === "fatto" ? (
        <p className={`${s.status} ${s.ok}`}>Fatto: {destName} è tra i tuoi obiettivi. <Link href="/salvadanaio">Apri il salvadanaio</Link></p>
      ) : (
        <button type="button" className={`${s.btn} ${s.pigCta}`} onClick={metti} disabled={stato === "busy"}>
          {stato === "busy" ? "Salvataggio…" : `Metti da parte per ${destName}`}
        </button>
      )}
      {stato === "errore" && <p className={`${s.status} ${s.no}`}>Non è andata a buon fine. Ricarica la pagina e riprova.</p>}

      {remain > 0 && (
        <p className={s.pigTip}>
          Vuoi mettere da parte soldi veri? Crea uno spazio di risparmio nell&apos;app della tua banca o della tua carta prepagata
          (molte lo permettono, per esempio Revolut e N26) e imposta un versamento automatico di {fmt(inTempo ? monthly : perData)} al mese.
          Il salvadanaio di Valigia Leggera ti dice quanto e fino a quando; i soldi restano sul tuo conto.
        </p>
      )}
    </section>
  );
}

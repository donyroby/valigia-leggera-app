import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import s from "@/components/viaggi.module.css";
import Offerte from "./Offerte";
import { ALL, DEPS } from "@/lib/viaggi/dati";
import { isHere, contOf, aviasalesUrl, isoOf, addDays } from "@/lib/viaggi/calcoli";
import { offerteDa, codiceCitta, tokenPresente } from "@/lib/voli/travelpayouts";
import { nomeCompagnia } from "@/lib/voli/compagnie";

export const metadata = {
  title: "Offerte della settimana · Valigia Leggera",
  description: "I voli andata e ritorno più economici trovati di recente dal tuo aeroporto, verso le mete di Valigia Leggera.",
};

const meseDi = (offset) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + offset); return isoOf(d).slice(0, 7); };
const notti = (a, b) => Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 864e5);

// La meta di Valigia Leggera che corrisponde alla destinazione del volo (la prima: le mete curate vengono prima)
function metaPer(volo) {
  return ALL.find((d) => d.iata === volo.destinazione) || ALL.find((d) => codiceCitta(d.iata) === volo.cittaDestinazione) || null;
}

export default async function OffertePage({ searchParams }) {
  const sp = await searchParams;
  const da = DEPS.some((x) => x.id === sp?.da) ? sp.da : "FCO";
  const dep = DEPS.find((x) => x.id === da);
  const oggi = isoOf(new Date());

  const risposte = await Promise.all([offerteDa(da, meseDi(0)), offerteDa(da, meseDi(1)), offerteDa(da, meseDi(2))]);
  const errore = risposte.every((r) => !r.ok) ? risposte[0].motivo : null;

  // Per ogni meta teniamo il volo più economico con partenza da domani in poi e durata da 2 a 10 notti
  const migliori = new Map();
  for (const r of risposte) for (const v of r.voli) {
    if (!v.andata || !v.ritorno || v.andata <= oggi) continue;
    const n = notti(v.andata, v.ritorno);
    if (n < 2 || n > 10) continue;
    const d = metaPer(v);
    if (!d || isHere(d, da)) continue;
    const prima = migliori.get(d.id);
    if (!prima || v.prezzo < prima.prezzo) {
      migliori.set(d.id, {
        id: d.id, nome: d.name, paese: d.it ? "Italia" : d.cc, zona: contOf(d),
        prezzo: v.prezzo, andata: v.andata, ritorno: v.ritorno, notti: n,
        compagnia: nomeCompagnia(v.compagnia), scali: v.scaliAndata,
        linkVolo: aviasalesUrl(da, codiceCitta(d.iata), v.andata, v.ritorno, 1),
        linkViaggio: `/meta/${d.id}?${new URLSearchParams({ da, data: v.andata, notti: String(n), persone: "2", bambini: "0", profilo: "coppia", mezzo: "volo", canc: "1" })}`,
      });
    }
  }
  const offerte = [...migliori.values()].sort((a, b) => a.prezzo - b.prezzo);

  return (
    <div className={s.page}>
      <TopBar />
      <div className={s.summary}>
        <h1 className={s.pageTitle}>Offerte della settimana</h1>
        <span>Voli veri, andata e ritorno, trovati di recente su Aviasales</span>
      </div>
      <Offerte
        da={da}
        aeroporti={DEPS.map((x) => ({ id: x.id, nome: x.n }))}
        nomePartenza={dep.n}
        offerte={offerte}
        errore={errore}
        senzaToken={!tokenPresente()}
      />
      <p className={s.fine}>
        I prezzi sono quelli trovati negli ultimi giorni dagli utenti di Aviasales, a persona e andata e ritorno: possono
        cambiare fino al momento della prenotazione. Mostriamo solo le mete di Valigia Leggera, con partenze nei prossimi tre
        mesi e soggiorni da 2 a 10 notti. &quot;Calcola il viaggio&quot; apre la scheda con alloggio, pasti e attività stimati per 2 persone.
      </p>
      <p className={s.fine}>
        I link ad Aviasales sono di affiliazione: se prenoti, Valigia Leggera può ricevere una commissione, senza costi in più per te.
      </p>
      <Footer />
    </div>
  );
}

// Le offerte si aggiornano al massimo ogni 6 ore (i dati dei voli sono già in memoria per 6 ore)
export const revalidate = 21600;

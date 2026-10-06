import Link from "next/link";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import s from "@/components/viaggi.module.css";
import TopBar from "@/components/TopBar";
import SaveButton from "./SaveButton";
import Condividi from "./Condividi";
import { ALL } from "@/lib/viaggi/dati";
import { calc, links, itinerary, fmt, seasonLabel, isHere } from "@/lib/viaggi/calcoli";
import { etichetta } from "@/lib/viaggi/condividi";
import { daIndirizzo, budgetDaIndirizzo, versoIndirizzo, stessoViaggio } from "@/lib/viaggi/parametri";
import { createClient } from "@/lib/supabase/server";

const mapsUrl = (name, city) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(name + ", " + city);


export async function generateMetadata({ params, searchParams }) {
  const { id } = await params;
  const d = ALL.find((x) => x.id === id);
  if (!d) return { title: "Meta non trovata · Valigia Leggera" };
  // Anteprima del link condiviso: meta, partenza, notti e costo stimato a persona
  const p = daIndirizzo(await searchParams);
  const r = calc(d, p);
  const titolo = `Viaggio a ${d.name} · Valigia Leggera`;
  const descrizione = `Da ${r.dep.n}, ${p.nights} ${p.nights === 1 ? "notte" : "notti"}, ${p.people} ${p.people === 1 ? "persona" : "persone"}: circa ${fmt(r.pp)} a persona (stima). Costi voce per voce, itinerario e link per prenotare.`;
  return {
    title: titolo,
    description: descrizione,
    // L'anteprima di una meta ridefinisce tutto il blocco: va ripetuta anche l'immagine comune
    openGraph: {
      type: "website", locale: "it_IT", siteName: "Valigia Leggera", url: `/meta/${d.id}`,
      title: titolo, description: descrizione,
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Valigia Leggera: dove ti porta il tuo budget" }],
    },
    twitter: { card: "summary_large_image", title: titolo, description: descrizione, images: ["/opengraph-image.png"] },
  };
}

export default async function MetaPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const d0 = ALL.find((x) => x.id === id);
  if (!d0) notFound();

  const p = daIndirizzo(sp);
  const budget = budgetDaIndirizzo(sp);
  const r = calc(d0, p);
  const { d, parts, total, pp } = r;
  const L = links(r);
  const it = itinerary(r);
  const qs = versoIndirizzo({ ...p, budget: budget ?? undefined });
  const here = `/meta/${d.id}?${qs}`;

  // Utente collegato e viaggio già salvato?
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let savedId = null;
  if (user) {
    const { data } = await supabase.from("saved_trips").select("*").eq("destination_id", d.id);
    const match = (data || []).find((row) => stessoViaggio(row, d.id, p));
    savedId = match ? match.id : null;
  }

  const trLabel = d.mode === "treno" ? "Treno o bus, andata e ritorno" : "Volo andata e ritorno";
  const rows = [
    [trLabel, "da " + r.dep.n + ", " + p.people + " pers. · circa " + r.hrs, parts.trav],
    [r.lodgLabel, p.nights + " notti · " + seasonLabel(p.date), parts.lodg],
    ["Pasti e cibo", p.nights + 1 + " giorni", parts.food],
    ["Spostamenti locali", "mezzi pubblici e taxi occasionali", parts.trans],
    ["Attività e ingressi", "musei, visite, esperienze", parts.act],
  ];
  const groups = d.mode === "treno"
    ? [["Prenota il treno o il bus", L.treni], ["Oppure vai in aereo", L.voli]]
    : [["Prenota il volo", L.voli], ["Oppure vai in treno o bus", L.treni]];
  const ext = { target: "_blank", rel: "noopener noreferrer sponsored" };
  const linkList = (arr) => (
    <div className={s.links}>
      {arr.map(([n, u]) => <a key={u + n} className={`${s.btn} ${s.sun}`} href={u} {...ext}>{etichetta(n)}</a>)}
    </div>
  );

  return (
    <div className={s.page} data-profile={p.profile}>
      <TopBar />
      <p className={`${s.back} ${s.noprint}`}><Link href="/">← Torna alla ricerca</Link></p>

      <article className={s.detail}>
        <div className={s.dlgHead}>
          <div>
            <h1>{d.name}</h1>
            <p className={s.note}>{d.note}</p>
          </div>
          <span className={s.tag}>{d.it ? "Italia" : d.cc}</span>
        </div>

        {isHere(d0, p.from) && (
          <p className={s.empty}>Parti già da {d.name}: scegli un aeroporto di partenza diverso per vedere un costo sensato.</p>
        )}

        <h2 className={s.h}>Quanto costa</h2>
        <table className={s.cost}>
          <tbody>
            {rows.map(([a, b, c]) => (
              <tr key={a}><td>{a}<small>{b}</small></td><td>{fmt(c)}</td></tr>
            ))}
            <tr className={s.sum}><td>Totale<small>{fmt(pp)} a persona</small></td><td>{fmt(total)}</td></tr>
          </tbody>
        </table>
        {budget != null && (
          <p className={`${s.status} ${pp <= budget ? s.ok : s.no}`}>
            {pp <= budget ? `Dentro il tuo budget di ${fmt(budget)} a persona` : `${fmt(pp - budget)} oltre il tuo budget di ${fmt(budget)} a persona`}
          </p>
        )}

        <div className={`${s.actions} ${s.noprint}`}>
          <SaveButton loggedIn={!!user} savedId={savedId} destId={d.id} params={p} pp={pp} budget={budget} here={here} />
        </div>
        <div className={s.actions}>
          <Condividi destId={d.id} params={p} />
        </div>

        <h2 className={s.h}>Itinerario proposto</h2>
        {it.map((day) => (
          <div key={day.title} className={s.day}>
            <h3>{day.title}</h3>
            <ul>
              {day.items.map(([slot, a], i) => {
                const isPlace = d.day.includes(a) || d.eve.includes(a);
                return (
                  <li key={slot + i}>
                    <span>
                      <b>{slot}</b>{a.n}
                      {isPlace && <> <a className={s.map} href={mapsUrl(a.n, d.name)} target="_blank" rel="noopener noreferrer">mappa</a></>}
                    </span>
                    <span>{a.c ? "~" + a.c + " € a persona" : "gratis"}</span>
                  </li>
                );
              })}
            </ul>
            <p className={s.hint}>{day.hint}</p>
          </div>
        ))}
        {p.nights + 1 > 8 && <p className={s.fine}>Mostrati i primi 8 giorni.</p>}
        <p className={s.fine}>Presto potrai anche creare un itinerario su misura per temi (luoghi da visitare, enogastronomico, natura e altri), come nel prototipo.</p>

        <p className={s.sumline}><b>La tua ricerca:</b> {L.sum}</p>
        {r.note && <p className={s.fine}>{r.note}</p>}

        {groups.map(([tt, arr]) => arr.length > 0 && (
          <section key={tt}><h2 className={s.h}>{tt}</h2>{linkList(arr)}</section>
        ))}

        <h2 className={s.h}>Prenota l&apos;alloggio</h2>
        <p className={s.fine}>
          {p.fc !== false ? "Filtro cancellazione gratuita attivo sul sito del partner: controlla sempre la data entro cui puoi annullare. " : ""}
          I link a Booking.com e Airbnb sono già filtrati per un prezzo a notte fino a circa {L.nightlyCap} €, calcolato sulla stima
          con un margine di sicurezza: aiuta a restare vicino al budget, ma non garantisce di trovare proprio quel prezzo.
          Il link Aviasales apre la ricerca alloggi con date e persone già inserite; la città va scritta a mano, usando il riepilogo qui sopra.
        </p>
        {linkList(L.alloggi)}

        {L.offerte.length > 0 && (
          <>
            <h2 className={s.h}>Esperienze e servizi</h2>
            <p className={s.fine}>
              Tour, esperienze, transfer dall&apos;aeroporto e, dove disponibili, pass per le attrazioni.
              Le offerte attive le decide il partner: apri il link per vedere quelle del momento.
            </p>
            {linkList(L.offerte)}
          </>
        )}

        <p className={s.fine}>
          Voli e alloggi si aprono con destinazione, date e persone già inserite. Per i treni i link portano al sito
          o a Google Maps (che può proporre anche autobus): tratta e date vanno inserite a mano. I filtri dei siti partner
          possono cambiare senza preavviso; i prezzi reali possono differire dalle stime.
        </p>
        <p className={s.fine}>
          Alcuni link sono di affiliazione: se prenoti tramite questi link, Valigia Leggera può ricevere una commissione,
          senza costi aggiuntivi per te.
        </p>
      </article>
      <Footer />
    </div>
  );
}

// Richiesta a Claude per un itinerario su misura (ripresa dal prototipo, solo sul server).
import { seasonLabel } from "@/lib/viaggi/calcoli";
import { TEMI, temiValidi } from "./temi";

export function itinPrompt(d, p, temiIn) {
  const themes = temiValidi(temiIn), days = Math.min(p.nights + 1, themes.length > 1 ? 5 : 6), themeLong = themes.length > 1;
  const THEME_TXT = {
    classico: `
TEMA: LUOGHI DA VISITARE. Le tappe sono i luoghi più significativi della città: monumenti, musei, chiese e palazzi storici, piazze, quartieri caratteristici e punti panoramici. Alterna i luoghi più celebri con qualche scorcio meno noto ma reale. Nel campo "what" spiega cosa si vede.`,
    enogastronomico: `
TEMA: viaggio ENOGASTRONOMICO. Le tappe sono luoghi legati al cibo e al vino: mercati storici, botteghe e salumerie, forni e pasticcerie, gelaterie storiche, osterie e trattorie note, enoteche, cantine visitabili (anche nei dintorni), laboratori di cucina. Per ogni tappa indica in "dish" il piatto o prodotto tipico da provare, con la denominazione corretta (per esempio DOP o IGP quando esiste). Per i locali cita solo quelli storici o molto noti di cui sei certo; se non sei certo del nome di un locale, indica il mercato, la via o il quartiere e il piatto, senza inventare il locale. ${themeLong ? 'Quando è combinato con altri temi, il cibo occupa i pasti: ogni giorno pranzo e cena (slot "Pranzo" e "Cena"), più a scelta una colazione o una merenda tipica; il resto della giornata segue gli altri temi.' : 'Ogni giorno ha colazione, pranzo, merenda o aperitivo e cena (slot "Colazione", "Pranzo", "Merenda", "Cena"), più al massimo una visita non legata al cibo.'} In "cost" indica la spesa indicativa a persona per quel pasto o assaggio. Il budget per pasti e assaggi è circa ${Math.round(d.fo * 1.3)} euro a persona al giorno. Per questo tema le regole 4 e 5 valgono in modo adattato: niente conteggio fisso di tappe.${p.profile === "famiglia" ? " Viaggiano bambini: niente degustazioni di alcolici, proponi mercati, dolci, laboratori e pasti adatti a tutta la famiglia." : ""}`,
    natura: `
TEMA: NATURA E ARIA APERTA. Le tappe sono parchi, sentieri, belvedere, laghi, coste, giardini e gite in luoghi naturali reali della città e dei dintorni, raggiungibili con mezzi pubblici. Nel campo "what" indica difficoltà e durata indicative. Se la città ha poca natura, scrivilo nel campo "tip" e proponi luoghi vicini reali.`,
    relax: `
TEMA: RELAX. Ritmo lento: al massimo 2 tappe al giorno e mattine senza sveglia. Le tappe sono terme, spa e centri benessere noti, giardini e parchi, belvedere tranquilli, caffè storici, librerie, passeggiate brevi, mercati da girare senza fretta. Nel campo "what" indica quanto tempo serve. Evita luoghi affollati o faticosi.`,
    notte: `
TEMA: VITA NOTTURNA. Le mattine sono libere (al massimo una tappa leggera prima di pranzo); il programma vero parte dal tardo pomeriggio: aperitivo, quartieri serali, locali di musica dal vivo, cocktail bar, birrerie storiche, club noti, piazze animate. Cita solo locali storici o molto noti di cui sei certo; se non sei certo del nome, indica il quartiere o la via. Nel campo "tip" aggiungi consigli su sicurezza e rientro (ultimi mezzi, zone da evitare a tarda ora). Solo per maggiorenni.${p.profile === "famiglia" ? " Viaggiano bambini: limita il programma a passeggiate serali, piazze animate e gelaterie." : ""}`,
    bambini: `
TEMA: CON BAMBINI. Le tappe sono adatte ai più piccoli: parchi e giardini con giochi, musei interattivi o della scienza, acquari e zoo, fattorie didattiche, giri in battello o trenino, gelaterie, spiagge sicure. Nel campo "what" indica l'età consigliata e se serve il passeggino. Ritmo lento: al massimo 2 attività al giorno, con una pausa dopo pranzo.`,
  };
  const who = {
    amici: "gruppo di amici giovani: budget contenuto, street food, vita serale",
    coppia: "coppia: atmosfera romantica e buon rapporto qualità/prezzo",
    famiglia: "famiglia con bambini: ritmo rilassato, attrazioni adatte ai più piccoli",
  }[p.profile];
  const nome = (t) => (TEMI.find((x) => x[0] === t) || [t, t])[1];
  return `Sei una guida turistica esperta di ${d.name} (${d.cc}). Crea un itinerario di ${days} giorni.${themes.map((t) => THEME_TXT[t]).join("")}${themes.length > 1 ? `\nTEMI COMBINATI: questo itinerario unisce ${themes.map(nome).join(" + ")}. Ogni tema deve essere ben rappresentato in ogni giornata, non solo uno. ${themes.includes("enogastronomico") ? "I pasti seguono il tema enogastronomico; mattina e pomeriggio sono dedicati agli altri temi, con 2 o 3 tappe vere al giorno (escluso il giorno di arrivo e quello di partenza)." : "Dai a ciascun tema circa metà delle tappe, con giornate coerenti."} Le indicazioni di struttura valgono in modo adattato.` : ""}

REGOLE OBBLIGATORIE
1. Cita SOLO luoghi che esistono davvero a ${d.name} (o nei dintorni, solo per un'eventuale gita), con il nome proprio esatto. Indica il quartiere o la via.
2. Vietato inventare. Se non sei sicuro al 100% che un luogo esista, omettilo: meglio meno tappe che una tappa sbagliata.
3. Vietate le voci generiche ("passeggiata in centro", "lungofiume", "museo principale"): ogni tappa ha un nome proprio. Non nominare fiumi, laghi, spiagge, montagne o mezzi di trasporto che la città non ha.
4. Ogni giorno raggruppa tappe vicine tra loro, in ordine geografico sensato: 2 o 3 tappe di giorno e 1 la sera.
5. Primo giorno: arrivo nel pomeriggio, solo una o due tappe leggere. Ultimo giorno: solo la mattina, poi il rientro.
6. Nel campo "what" spiega in una frase perché vale la pena, con un dettaglio concreto (cosa si vede o si fa).
7. "cost" è il costo indicativo dell'ingresso a persona in euro: 0 se gratuito, null se non lo sai. Non inventare orari di apertura né prezzi precisi.
8. Il budget per attività è circa ${Math.round(d.ac * 1.3)} euro a persona al giorno: alterna luoghi a pagamento e gratuiti.
9. Se i giorni sono più di 3, un giorno può essere una gita in un luogo reale vicino, raggiungibile con treno o bus.
10. Aggiungi 3 o 4 specialità o locali storici veri in "food".
${themes.includes("classico") ? "Livello atteso, per esempio per Verona: Arena, Casa di Giulietta in via Cappello, Piazza delle Erbe, Ponte Pietra sull'Adige, Castelvecchio." : ""}

CONTESTO
Viaggiatori: ${who}. Partenza ${p.date}, ${p.nights} notti, ${seasonLabel(p.date, d)}. Scrivi in italiano.

Sii conciso: "what" e "tip" al massimo 15 parole ciascuno.

Nel campo "kind" scrivi "cibo" per mercati, locali, botteghe, cantine e assaggi, "visita" per tutto il resto.

Rispondi SOLO con JSON in questa forma:
{"days":[{"title":"titolo del giorno","items":[{"slot":"Mattina","kind":"visita","name":"nome esatto del luogo","area":"quartiere o via","what":"una frase","dish":"piatto o prodotto tipico (solo tema enogastronomico, altrimenti stringa vuota)","cost":0}],"tip":"consiglio pratico breve"}],"food":[{"name":"nome del locale o piatto","what":"una frase"}]}`;
}

// Estrae e controlla il JSON della risposta (Claude a volte aggiunge testo o ``` attorno)
export function leggiItinerario(testo) {
  const a = testo.indexOf("{"), b = testo.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  let data;
  try { data = JSON.parse(testo.slice(a, b + 1)); } catch { return null; }
  if (!data || !Array.isArray(data.days) || !data.days.length) return null;
  const str = (v, n) => (typeof v === "string" ? v.slice(0, n) : "");
  return {
    days: data.days.slice(0, 8).map((g, i) => ({
      title: str(g.title, 120) || "Giorno " + (i + 1),
      items: (Array.isArray(g.items) ? g.items : []).slice(0, 10).map((x) => ({
        slot: str(x.slot, 30), kind: x.kind === "cibo" ? "cibo" : "visita", name: str(x.name, 140), area: str(x.area, 120),
        what: str(x.what, 400), dish: str(x.dish, 160), cost: typeof x.cost === "number" && x.cost >= 0 && x.cost < 1000 ? Math.round(x.cost) : null,
      })).filter((x) => x.name),
      tip: str(g.tip, 400),
    })),
    food: (Array.isArray(data.food) ? data.food : []).slice(0, 6).map((f) => ({ name: str(f.name, 140), what: str(f.what, 300) })).filter((f) => f.name),
  };
}

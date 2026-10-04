// Testo da condividere per un viaggio, ripreso da shareText del prototipo.
// Differenze: niente itinerario su misura (arriverà con i tester), etichette dei link
// senza "la tua commissione" e, in fondo, il link alla scheda del viaggio sul sito.
import { links, itinerary, fmt } from "./calcoli";

const mapsShort = (n, c) => "https://maps.google.com/?q=" + encodeURIComponent(n + ", " + c);
const FOOD_RE = /pizza|cena|aperitivo|street food|trattoria|osteria|tigelle|tagliatelle|lampredotto|cicchetti|pasticciotto|orecchiette|culurgiones|francesinha|paella|tapas|horchata|pierogi|goulash|souvlaki|currywurst|past[eé]is|caff[eè]|birr|rakia|picnic|vodka|cafe|heuriger|mercato|ristorante|forno|gelat|cantina|enoteca/i;
const isFood = (slot, name) => /^(Colazione|Pranzo|Merenda|Cena|Aperitivo)$/i.test(slot || "") || FOOD_RE.test(name || "");
export const etichetta = (n) => n.replace(" (con la tua commissione)", "").replace(" (con tratta e date, i tuoi link)", " (tratta e date già inserite)");

export function testoViaggio(r, o = {}) {
  const compact = !!o.compact, d = r.d, L = links(r), out = [];
  const item = (x) => "• " + (compact ? "" : x.slot + ": ") + x.name + (x.link === false ? "" : "\n  " + mapsShort(x.name, d.name));
  out.push("Viaggio a " + d.name + " · Valigia Leggera");
  out.push(L.sum);
  out.push("Costo stimato: " + fmt(r.pp) + " a persona (" + fmt(r.total) + " in tutto). È una stima: verifica prezzi e orari prima di prenotare.");
  out.push("");
  // L'itinerario di base ha luoghi veri solo per le mete principali; per le città stimate sono indicazioni generiche
  if (!d.est) {
    itinerary(r).forEach((day) => {
      const items = day.items.map(([slot, a]) => ({ slot, name: a.n, link: d.day.includes(a) || d.eve.includes(a), food: isFood(slot, a.n) }));
      out.push(day.title.toUpperCase());
      const vis = items.filter((x) => !x.food), eat = items.filter((x) => x.food);
      if (vis.length) { out.push("Da visitare"); vis.forEach((x) => out.push(item(x))); }
      if (eat.length) { out.push("Dove mangiare"); eat.forEach((x) => out.push(item(x))); }
      out.push("");
    });
  }
  if (o.book) {
    out.push("PRENOTA");
    if (L.voli.length) out.push(etichetta(L.voli[0][0]) + ": " + L.voli[0][1]);
    if (L.treni.length) out.push(etichetta(L.treni[0][0]) + ": " + L.treni[0][1]);
    // "Cancellazione gratuita" solo se il link applica davvero il filtro (Booking e Airbnb; il link Aviasales no)
    const al = L.alloggi[0], filtro = r.p.fc !== false && /booking\.com|airbnb/.test(al[1]);
    out.push(etichetta(al[0]) + (filtro ? " (cancellazione gratuita)" : "") + ": " + al[1]);
    out.push("");
  }
  if (o.url) out.push("Apri il viaggio su Valigia Leggera: " + o.url);
  return out.join("\n").trim();
}

// Le quattro versioni, dalla più completa alla più corta, come nel prototipo
export function versioni(r, url) {
  return [{ compact: false, book: true }, { compact: false, book: false }, { compact: true, book: true }, { compact: true, book: false }]
    .map((o) => testoViaggio(r, { ...o, url }));
}

// Trasforma i parametri di un viaggio in un indirizzo (per la scheda di dettaglio)
// e in una riga della tabella saved_trips, e viceversa. Controlla sempre i valori.
import { DEPS } from "./dati";
import { defaultDate } from "./calcoli";

const PROFILI = ["amici", "coppia", "famiglia"];
const MEZZI = ["auto", "treno", "volo"];
const int = (v, min, max, def) => { const n = parseInt(v, 10); return Number.isInteger(n) && n >= min && n <= max ? n : def; };
const isoOk = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(new Date(v + "T12:00:00"));

// Parametri completi e validi, a partire da valori qualsiasi
export function normalizza(v) {
  const profile = PROFILI.includes(v.profile) ? v.profile : "coppia";
  const people = int(v.people, 1, 8, profile === "famiglia" ? 4 : profile === "amici" ? 3 : 2);
  const kids = Math.min(int(v.kids, 0, 4, 0), people - 1);
  const agesIn = Array.isArray(v.kidsAges) ? v.kidsAges : [];
  const kidsAges = Array.from({ length: kids }, (_, i) => int(agesIn[i], 0, 17, 8));
  return {
    from: DEPS.some((d) => d.id === v.from) ? v.from : "FCO",
    date: isoOk(v.date) ? v.date : defaultDate(),
    nights: int(v.nights, 1, 30, 3),
    people, kids, kidsAges, profile,
    tm: MEZZI.includes(v.tm) ? v.tm : "auto",
    fc: v.fc !== false,
  };
}

export function versoIndirizzo(p) {
  const q = new URLSearchParams({
    da: p.from, data: p.date, notti: String(p.nights), persone: String(p.people),
    bambini: String(p.kids || 0), profilo: p.profile, mezzo: p.tm || "auto", canc: p.fc === false ? "0" : "1",
  });
  if (p.kids) q.set("eta", (p.kidsAges || []).slice(0, p.kids).join(","));
  if (Number.isFinite(p.budget)) q.set("budget", String(p.budget));
  return q.toString();
}

export function daIndirizzo(sp) {
  const g = (k) => (sp && typeof sp[k] === "string" ? sp[k] : undefined);
  return normalizza({
    from: g("da"), date: g("data"), nights: g("notti"), people: g("persone"), kids: g("bambini"),
    kidsAges: (g("eta") || "").split(",").filter(Boolean), profile: g("profilo"), tm: g("mezzo"), fc: g("canc") !== "0",
  });
}

export function versoRiga(d, p, pp, budget) {
  return {
    destination_id: d.id, destination_name: d.name, departure_airport: p.from, date_out: p.date,
    nights: p.nights, people: p.people, kids: p.kids, kids_ages: p.kidsAges, profile: p.profile,
    travel_mode: p.tm, free_cancel: p.fc !== false, price_pp: pp, budget: Number.isFinite(budget) ? budget : null,
  };
}

export function daRiga(row) {
  return normalizza({
    from: row.departure_airport, date: row.date_out, nights: row.nights, people: row.people, kids: row.kids,
    kidsAges: row.kids_ages, profile: row.profile, tm: row.travel_mode, fc: row.free_cancel !== false,
  });
}

export const budgetDaIndirizzo = (sp) => { const n = parseInt(sp && sp.budget, 10); return Number.isInteger(n) && n >= 0 && n <= 100000 ? n : null; };

// Due viaggi sono lo stesso viaggio se meta e parametri coincidono
export const stessoViaggio = (row, destId, p) => {
  const a = daRiga(row);
  return row.destination_id === destId && JSON.stringify(a) === JSON.stringify(normalizza(p));
};

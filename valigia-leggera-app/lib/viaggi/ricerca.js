// Logica della pagina di ricerca, presa da renderSearch del prototipo,
// separata dalla parte grafica.
import { DEPS, ALL, norm } from "./dati";
import { calc, usable, isHere, todayISO, addDays, daysBetween, defaultDate } from "./calcoli";

export const DEFAULT_PEOPLE = { amici: 3, coppia: 2, famiglia: 4 };

export const FILTRI = [
  ["tutte", "Tutte"], ["italia", "Italia"], ["europa", "Europa"], ["mare", "Mare"],
  ["arte", "Arte e città"], ["cibo", "Enogastronomia"], ["natura", "Natura"],
];

// Stato iniziale, uguale a quello del prototipo
export function statoIniziale() {
  const date = defaultDate();
  return {
    profile: "coppia", from: "FCO", date, ret: addDays(date, 3), nights: 3,
    fc: true, tm: "auto", dest: "tutte", destQ: "", people: 2, kids: 0, kidsAges: [],
    budget: 300, filter: "tutte",
  };
}

// Corregge uno stato salvato (date passate, valori fuori scala), come fa il prototipo all'avvio
export function sistemaStato(s) {
  const st = { ...statoIniziale(), ...(s || {}) };
  if (!DEPS.some((d) => d.id === st.from)) st.from = "FCO";
  if (!["amici", "coppia", "famiglia"].includes(st.profile)) st.profile = "coppia";
  if (st.date < todayISO()) st.date = defaultDate();
  if (!st.ret || st.ret <= st.date) st.ret = addDays(st.date, st.nights || 3);
  if (daysBetween(st.date, st.ret) > 30) st.ret = addDays(st.date, 30);
  st.nights = daysBetween(st.date, st.ret);
  if (!Number.isInteger(st.people) || st.people < 1 || st.people > 8) st.people = DEFAULT_PEOPLE[st.profile];
  if (!Number.isInteger(st.kids) || st.kids < 0) st.kids = 0;
  if (st.kids > st.people - 1) st.kids = Math.max(0, st.people - 1);
  if (!Array.isArray(st.kidsAges)) st.kidsAges = [];
  while (st.kidsAges.length < st.kids) st.kidsAges.push(8);
  st.kidsAges = st.kidsAges.slice(0, st.kids);
  if (!Number.isFinite(st.budget)) st.budget = 300;
  st.budget = Math.min(1000, Math.max(80, st.budget));
  if (st.dest !== "tutte" && st.dest !== "?" && !ALL.some((d) => d.id === st.dest)) st.dest = "tutte";
  if (!FILTRI.some(([k]) => k === st.filter)) st.filter = "tutte";
  return st;
}

// Interpreta quello che l'utente scrive nel campo "Destinazione"
export function scegliDestinazione(testo) {
  const n = norm(testo || "");
  if (!n) return { dest: "tutte", destQ: "" };
  const m = ALL.find((d) => norm(d.name) === n);
  return m ? { dest: m.id, destQ: m.name } : { dest: "?", destQ: testo };
}

export function suggerimenti(testo) {
  const q = norm(testo || ""), head = q.slice(0, 3);
  return ALL.filter((d) => { const n = norm(d.name); return q && (n.includes(q) || n.startsWith(head) || q.includes(n)); }).slice(0, 6);
}

// Risultati della ricerca: stessa logica e stesso ordine del prototipo
export function cerca(st) {
  const f = st.filter;
  const list = usable(st).filter((d) => f === "tutte" || (f === "italia" ? d.it : f === "europa" ? !d.it : d.tags.includes(f)));
  let chosen = null, notFound = false;
  if (st.dest === "?") notFound = true;
  else if (st.dest !== "tutte") {
    const cd = ALL.find((x) => x.id === st.dest);
    chosen = cd && !isHere(cd, st.from) ? calc(cd, st) : false;
  }
  const rs = list.filter((d) => !(chosen && d.id === chosen.d.id)).map((d) => calc(d, st)).sort((a, b) => a.pp - b.pp);
  const inb = rs.filter((r) => r.pp <= st.budget), over = rs.filter((r) => r.pp > st.budget);
  const titolo = notFound ? "Città non trovata"
    : chosen ? "Il tuo viaggio a " + chosen.d.name
    : chosen === false ? "Meta non disponibile da qui"
    : inb.length ? (inb.length === 1 ? "1 meta dentro il budget" : inb.length + " mete dentro il budget")
    : "Nessuna meta dentro il budget";
  return { chosen, notFound, inb, over, cheapest: rs[0] || null, titolo, dep: DEPS.find((x) => x.id === st.from) };
}

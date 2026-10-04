// Proposte low cost, prese dal prototipo (contList, reasonFor, renderLow) senza la parte grafica.
import { ALL, DESTS, MONTH_PICKS, WORLD_NOTES, SAVE_TIPS, MESI } from "./dati";
import { calc, isHere, contOf, usable } from "./calcoli";

export { MESI, SAVE_TIPS };
export const NOTTI_LC = [2, 3, 4, 6, 8];
export const CAP_LC = [150, 200, 250, 300, 400, 600, 900];

const usableAll = (from) => ALL.filter((d) => !isHere(d, from));

export function reasonFor(id, cont, month) {
  if (cont === "mondo") return WORLD_NOTES[id] || null;
  const p = (MONTH_PICKS[month] || []).find((x) => x[0] === id);
  return p ? p[1] : null;
}

// Mete di un continente sotto il tetto di spesa: prima quelle consigliate per il mese, poi le più economiche
export function contList(cont, cap, date, nights, limit, base, month) {
  const list = usableAll(base.from).filter((d) => contOf(d) === cont).map((d) => {
    const r = calc(d, { ...base, date, nights }), reason = reasonFor(d.id, cont, month);
    return { r, reason, badge: cont !== "mondo" && reason ? "Consigliata per il mese" : null };
  }).filter((x) => x.r.pp <= cap);
  list.sort((a, b) => { const ra = a.reason ? 0 : 1, rb = b.reason ? 0 : 1; return ra !== rb ? ra - rb : a.r.pp - b.r.pp; });
  return list.slice(0, limit);
}

export function piuEconomica(cont, date, nights, base) {
  return usableAll(base.from).filter((d) => contOf(d) === cont).map((d) => calc(d, { ...base, date, nights })).sort((a, b) => a.pp - b.pp)[0] || null;
}

// "Idee per le date che hai scelto": le mete principali, con la data della ricerca e le notti scelte qui
export function ideeDate(base, nights, cap) {
  const p = { ...base, nights };
  const rs = usable(p).map((d) => calc(d, p)).sort((a, b) => a.pp - b.pp);
  return { ok: rs.filter((r) => r.pp <= cap).slice(0, 10), cheapest: rs[0] || null };
}

export { DESTS };

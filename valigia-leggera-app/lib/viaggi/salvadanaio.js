// Calcoli del salvadanaio, presi dal prototipo (renderPiggy*), senza la parte grafica.
import { ALL, MESI } from "./dati";
import { calc, isHere, isoOf, todayISO } from "./calcoli";
import { daRiga } from "./parametri";

export const NOTTI_SALVADANAIO = 3; // il prototipo ragiona su un weekend breve
const usableAll = (from) => ALL.filter((d) => !isHere(d, from));

// Data di riferimento del mese i (0 = questo mese), il 15 del mese come nel prototipo
export function piggyDate(i) { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + i, 15); return isoOf(d); }

// Mete che si possono già permettere con quanto c'è nel salvadanaio
export function meteAdesso(total, base) {
  const date = todayISO();
  const all = usableAll(base.from).map((d) => calc(d, { ...base, date, nights: NOTTI_SALVADANAIO })).sort((a, b) => a.pp - b.pp);
  return { list: all.filter((r) => r.pp <= total).slice(0, 8), cheapest: all[0] || null };
}

// Obiettivo libero in euro
export function obiettivo(target, total, monthly) {
  if (!(target > 0)) return null;
  const pct = Math.min(100, Math.round((total / target) * 100)), remain = Math.max(0, target - total), done = total >= target;
  let mesi = null, quando = null;
  if (!done && monthly > 0) {
    mesi = Math.max(1, Math.ceil(remain / monthly));
    const dt = new Date(); dt.setDate(1); dt.setMonth(dt.getMonth() + mesi);
    quando = MESI[dt.getMonth()] + " " + dt.getFullYear();
  }
  return { pct, remain, done, mesi, quando };
}

// I viaggi salvati come obiettivi, dal più economico
export function obiettiviViaggi(rows, total, monthly) {
  return (rows || []).map((row) => {
    const d = ALL.find((x) => x.id === row.destination_id);
    if (!d) return null;
    const p = daRiga(row), r = calc(d, p), cost = r.pp;
    const done = total >= cost, remain = Math.max(0, cost - total);
    return {
      id: row.id, d, p, r, cost, done, remain,
      pct: Math.min(100, Math.round((total / cost) * 100)),
      // Nel prototipo, senza cifra mensile, si dividevano i soldi mancanti per 1 € al mese: qui i mesi compaiono solo se la cifra c'è
      mesi: !done && monthly > 0 ? Math.max(1, Math.ceil(remain / monthly)) : null,
    };
  }).filter(Boolean).sort((a, b) => a.cost - b.cost);
}

// Cosa si potrà permettere nei prossimi 8 mesi, continuando a mettere via la cifra mensile
export function lineaDelTempo(monthly, already, base) {
  const rows = [];
  for (let i = 0; i < 8; i++) {
    const date = piggyDate(i), cum = already + monthly * i;
    const dt = new Date(); dt.setDate(1); dt.setMonth(dt.getMonth() + i);
    const label = i === 0 ? "Adesso" : MESI[dt.getMonth()][0].toUpperCase() + MESI[dt.getMonth()].slice(1) + (dt.getFullYear() !== new Date().getFullYear() ? " " + dt.getFullYear() : "");
    const all = usableAll(base.from).map((d) => calc(d, { ...base, date, nights: NOTTI_SALVADANAIO })).sort((a, b) => a.pp - b.pp);
    const list = all.filter((r) => r.pp <= cum);
    rows.push({ label, cum, top: list.slice(0, 2), cheapest: list.length ? null : all[0] || null });
  }
  return rows;
}

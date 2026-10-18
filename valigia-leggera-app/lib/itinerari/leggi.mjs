// Senza import: lo usano sia il sito (Next.js) sia la funzione Netlify in background.
// Le tappe arrivano come array compatti [slot, kind, name, area, what, dish, cost] (meno testo = più veloce);
// accetta anche il vecchio formato a oggetti.
const daArray = (x) => (Array.isArray(x) ? { slot: x[0], kind: x[1], name: x[2], area: x[3], what: x[4], dish: x[5], cost: x[6] } : x || {});

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
      items: (Array.isArray(g.items) ? g.items : []).slice(0, 10).map(daArray).map((x) => ({
        slot: str(x.slot, 30), kind: x.kind === "cibo" || x.kind === "c" ? "cibo" : "visita", name: str(x.name, 140), area: str(x.area, 120),
        what: str(x.what, 400), dish: str(x.dish, 160), cost: typeof x.cost === "number" && x.cost >= 0 && x.cost < 1000 ? Math.round(x.cost) : null,
      })).filter((x) => x.name),
      tip: str(g.tip, 400),
    })),
    food: (Array.isArray(data.food) ? data.food : []).slice(0, 6).map((f) => (Array.isArray(f) ? { name: f[0], what: f[1] } : f || {})).map((f) => ({ name: str(f.name, 140), what: str(f.what, 300) })).filter((f) => f.name),
  };
}

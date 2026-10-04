// Confronta i calcoli dell'app con quelli del prototipo, meta per meta.
// Uso: node scripts/verifica.mjs percorso/prototipo.js
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import os from "node:os";

const protoFile = process.argv[2];
if (!protoFile) { console.error("Indica il file del prototipo"); process.exit(2); }

// 1. Prototipo: carico dati e calcoli (righe fino a usableAll) in un ambiente isolato
const lines = fs.readFileSync(protoFile, "utf8").split("\n");
const end = lines.findIndex(l => l.startsWith("const usableAll"));
const store = {};
const ctx = vm.createContext({ localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = v; } }, console });
vm.runInContext(lines.slice(0, end + 1).join("\n") + "\n;globalThis.P={DEPS,ALL,DESTS,calc,links,itinerary,usable,state,seasonLabel,isHere};", ctx);
const P = ctx.P;

// 2. App: copio i moduli in una cartella temporanea con le estensioni che Node richiede
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vl-"));
const src = path.resolve("lib/viaggi");
fs.writeFileSync(path.join(tmp, "dati.mjs"), fs.readFileSync(path.join(src, "dati.js"), "utf8"));
fs.writeFileSync(path.join(tmp, "calcoli.mjs"), fs.readFileSync(path.join(src, "calcoli.js"), "utf8").replace('from "./dati"', 'from "./dati.mjs"'));
const N = await import(path.join(tmp, "calcoli.mjs"));
const ND = await import(path.join(tmp, "dati.mjs"));

// 3. Confronto su tante combinazioni
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let checks = 0, errors = [];
const dates = ["2026-01-20", "2026-04-10", "2026-06-12", "2026-08-07", "2026-11-13"];
if (ND.ALL.length !== P.ALL.length) errors.push(`numero di mete diverso: ${ND.ALL.length} contro ${P.ALL.length}`);
for (const dep of P.DEPS) for (const profile of ["amici", "coppia", "famiglia"]) for (const tm of ["auto", "treno", "volo"]) for (const date of dates) {
  const people = profile === "famiglia" ? 4 : profile === "coppia" ? 2 : 3;
  const p = { ...P.state, from: dep.id, profile, tm, date, nights: profile === "amici" ? 2 : 4, people, kids: profile === "famiglia" ? 2 : 0, kidsAges: profile === "famiglia" ? [5, 9] : [], fc: date < "2026-06-01" };
  P.state.fc = p.fc; P.state.from = dep.id;
  for (let i = 0; i < P.ALL.length; i++) {
    const a = P.calc(P.ALL[i], p), b = N.calc(ND.ALL[i], p);
    checks++;
    if (!same({ ...a, p: null }, { ...b, p: null })) { errors.push(`calcolo: ${a.d.name} da ${dep.id}, ${profile}, ${tm}, ${date}`); continue; }
    if (!same(P.links(a), N.links(b))) errors.push(`link: ${a.d.name} da ${dep.id}, ${profile}, ${date}`);
    if (!same(P.itinerary(a), N.itinerary(b))) errors.push(`itinerario: ${a.d.name}`);
    if (P.isHere(P.ALL[i]) !== N.isHere(ND.ALL[i], dep.id)) errors.push(`partenza da casa: ${a.d.name} da ${dep.id}`);
  }
  if (!same(P.usable(p).map(d => d.id), N.usable(p).map(d => d.id))) errors.push(`elenco mete da ${dep.id}`);
}
console.log(`Confronti eseguiti: ${checks.toLocaleString("it-IT")} (mete: ${ND.ALL.length}, aeroporti: ${P.DEPS.length})`);
if (errors.length) { console.log(`DIFFERENZE: ${errors.length}`); console.log(errors.slice(0, 20).join("\n")); process.exit(1); }
console.log("Nessuna differenza: i risultati dell'app sono identici a quelli del prototipo.");

// 4. Ricerca completa: stesso elenco e stesso ordine del prototipo
fs.writeFileSync(path.join(tmp, "ricerca.mjs"), fs.readFileSync(path.join(src, "ricerca.js"), "utf8").replace('from "./dati"', 'from "./dati.mjs"').replace('from "./calcoli"', 'from "./calcoli.mjs"'));
const R = await import(path.join(tmp, "ricerca.mjs"));
let rErr = 0, rChecks = 0;
for (const dep of P.DEPS) for (const filter of R.FILTRI.map(([k]) => k)) for (const budget of [150, 300, 600]) for (const dest of ["tutte", "lis", "c_verona", ...(dep.ex ? [] : [])]) {
  const st = { ...R.statoIniziale(), from: dep.id, filter, budget, dest, date: "2026-11-13", ret: "2026-11-16", nights: 3 };
  const res = R.cerca(st);
  // riferimento: stessa sequenza di renderSearch nel prototipo
  const list = P.usable(st).filter(d => filter === "tutte" || (filter === "italia" ? d.it : filter === "europa" ? !d.it : d.tags.includes(filter)));
  let chosen = null; if (dest !== "tutte") { const cd = P.ALL.find(x => x.id === dest); P.state.from = dep.id; chosen = cd && !P.isHere(cd) ? P.calc(cd, st) : false; }
  const rs = list.filter(d => !(chosen && d.id === chosen.d.id)).map(d => P.calc(d, st)).sort((a, b) => a.pp - b.pp);
  const ids = x => x.map(r => r.d.id).join(",");
  rChecks++;
  if (ids(res.inb) !== ids(rs.filter(r => r.pp <= budget)) || ids(res.over) !== ids(rs.filter(r => r.pp > budget)) || (chosen ? chosen.d.id : chosen) !== (res.chosen ? res.chosen.d.id : res.chosen)) { rErr++; if (rErr < 5) console.log("Ricerca diversa:", dep.id, filter, budget, dest); }
}
console.log(`Ricerche confrontate: ${rChecks}` + (rErr ? `, DIFFERENZE: ${rErr}` : ", nessuna differenza."));
if (rErr) process.exit(1);

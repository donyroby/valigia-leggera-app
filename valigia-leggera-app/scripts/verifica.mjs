// Confronta i calcoli dell'app con quelli del prototipo, meta per meta.
// Uso: node scripts/verifica.mjs percorso/prototipo.js
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import os from "node:os";

const protoFile = process.argv[2];
if (!protoFile) { console.error("Indica il file del prototipo"); process.exit(2); }

// 1. Prototipo: carico dati e calcoli (righe fino a usableAll) in un ambiente isolato
const [OLD_SEASON, NEW_SEASON] = ["function seasonF(iso){const m=new Date(iso+\"T12:00:00\").getMonth()+1;\n  if(m===7||m===8)return 1.35; if(m===12||m===4)return 1.15; if(m===6||m===9)return 1.08; if(m===1||m===2||m===11)return 0.85; return 1}\nfunction seasonLabel(iso){const f=seasonF(iso);return f>=1.3?\"alta stagione\":f>=1.1?\"stagione medio-alta\":f<1?\"bassa stagione\":\"stagione media\"}", "function seasonF(iso,d){const m=new Date(iso+\"T12:00:00\").getMonth()+1;\n  // Mete con la stagione \"al contrario\" (caldo d'inverno, emisfero sud): alta da dicembre a marzo\n  if(d&&d.neve){if(m===12||m===1||m===2||m===3)return 1.25; if(m===7||m===8)return 1.3; if(m===6||m===9)return 1; return 0.85}\n  if(d&&d.inv){if(m===12||m===1||m===2||m===3)return 1.25; if(m===11||m===4)return 1.1; if(m>=6&&m<=9)return 0.85; return 1}\n  if(m===7||m===8)return 1.35; if(m===12||m===4)return 1.15; if(m===6||m===9)return 1.08; if(m===1||m===2||m===11)return 0.85; return 1}\nfunction seasonLabel(iso,d){const f=seasonF(iso,d);return f>=1.3?\"alta stagione\":f>=1.2?\"alta stagione\":f>=1.1?\"stagione medio-alta\":f<1?\"bassa stagione\":\"stagione media\"}"];
// Il prototipo usa i dati dell'app (comprese le mete aggiunte dopo), così si confronta solo la logica di calcolo.
// Le uniche modifiche alla logica: mete "solo in aereo" (nt), "fuori Europa a corto raggio" (breve) e stagione al contrario (inv) e località da sci (neve).
const lines = fs.readFileSync(protoFile, "utf8")
  .replace("const ALL=DESTS.concat(CITIES).concat(WORLD);", "const ALL=globalThis.__APP.ALL;DESTS.length=0;DESTS.push(...globalThis.__APP.DESTS);")
  .replace("  if(d.world){", "  if(d.world&&!d.breve){")
  .replace("const isl=ISL_FORCE.includes(d.iata)||islandOf", "const isl=ISL_FORCE.includes(d.iata)||d.nt||islandOf")
  .replace(OLD_SEASON, NEW_SEASON)
  .replace("pe=p.people, f=seasonF(p.date);", "pe=p.people, f=seasonF(p.date,d);")
  .split("\n");
const end = lines.findIndex(l => l.startsWith("const usableAll"));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vl-"));
const src = path.resolve("lib/viaggi");
fs.writeFileSync(path.join(tmp, "mete-europa.mjs"), fs.readFileSync(path.join(src, "mete-europa.js"), "utf8"));
fs.writeFileSync(path.join(tmp, "dati.mjs"), fs.readFileSync(path.join(src, "dati.js"), "utf8").replace('from "./mete-europa"', 'from "./mete-europa.mjs"'));
fs.writeFileSync(path.join(tmp, "mete-itinerari.mjs"), fs.readFileSync(path.join(src, "mete-itinerari.js"), "utf8"));
fs.writeFileSync(path.join(tmp, "dettagli.mjs"), fs.readFileSync(path.join(src, "dettagli.js"), "utf8").replace('from "./mete-itinerari"', 'from "./mete-itinerari.mjs"'));
const NDslim = await import(path.join(tmp, "dati.mjs"));
const { conDettagli } = await import(path.join(tmp, "dettagli.mjs"));
// Per confrontare anche gli itinerari servono le mete con luoghi e serate
const ALLD = NDslim.ALL.map(conDettagli), byId = new Map(ALLD.map((d) => [d.id, d]));
const ND = { ...NDslim, ALL: ALLD, DESTS: NDslim.DESTS.map((d) => byId.get(d.id)) };
globalThis.__APP = ND;
const store = {};
const ctx = vm.createContext({ localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = v; } }, console, __APP: ND });
vm.runInContext(lines.slice(0, end + 1).join("\n") + "\n;globalThis.P={DEPS,ALL,DESTS,calc,links,itinerary,usable,state,seasonLabel,isHere};", ctx);
const P = ctx.P;

// 2. App: copio i moduli in una cartella temporanea con le estensioni che Node richiede
fs.writeFileSync(path.join(tmp, "calcoli.mjs"), fs.readFileSync(path.join(src, "calcoli.js"), "utf8").replace('from "./dati"', 'from "./dati.mjs"'));
const N = await import(path.join(tmp, "calcoli.mjs"));

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
fs.mkdirSync(path.join(tmp, "voli"), { recursive: true });
for (const f of ["costoReale", "codici"]) fs.writeFileSync(path.join(tmp, "voli", f + ".mjs"), fs.readFileSync(path.resolve("lib/voli", f + ".js"), "utf8"));
fs.writeFileSync(path.join(tmp, "ricerca.mjs"), fs.readFileSync(path.join(src, "ricerca.js"), "utf8").replace('from "./dati"', 'from "./dati.mjs"').replace('from "./calcoli"', 'from "./calcoli.mjs"').replace('from "../voli/costoReale"', 'from "./voli/costoReale.mjs"').replace('from "../voli/codici"', 'from "./voli/codici.mjs"'));
const R = await import(path.join(tmp, "ricerca.mjs"));
let rErr = 0, rChecks = 0;
for (const dep of P.DEPS) for (const filter of R.FILTRI.map(([k]) => k)) for (const budget of [150, 300, 600]) for (const dest of ["tutte", "lis", "c_verona", ...(dep.ex ? [] : [])]) {
  const st = { ...R.statoIniziale(), from: dep.id, filter, budget, dest, date: "2026-11-13", ret: "2026-11-16", nights: 3 };
  const res = R.cerca(st);
  // riferimento: stessa sequenza di renderSearch nel prototipo
  const list = P.usable(st).filter(d => filter === "tutte" || (filter === "italia" ? d.it : filter === "europa" ? !d.it && !d.world : d.tags.includes(filter)));
  let chosen = null; if (dest !== "tutte") { const cd = P.ALL.find(x => x.id === dest); P.state.from = dep.id; chosen = cd && !P.isHere(cd) ? P.calc(cd, st) : false; }
  const rs = list.filter(d => !(chosen && d.id === chosen.d.id)).map(d => P.calc(d, st)).sort((a, b) => a.pp - b.pp);
  const ids = x => x.map(r => r.d.id).join(",");
  rChecks++;
  if (ids(res.inb) !== ids(rs.filter(r => r.pp <= budget)) || ids(res.over) !== ids(rs.filter(r => r.pp > budget)) || (chosen ? chosen.d.id : chosen) !== (res.chosen ? res.chosen.d.id : res.chosen)) { rErr++; if (rErr < 5) console.log("Ricerca diversa:", dep.id, filter, budget, dest); }
}
console.log(`Ricerche confrontate: ${rChecks}` + (rErr ? `, DIFFERENZE: ${rErr}` : ", nessuna differenza."));
if (rErr) process.exit(1);

// 5. Low cost: stesse proposte del mese del prototipo
{
  const end2 = lines.findIndex(l => l.startsWith("const $="));
  const ctx2 = vm.createContext({ localStorage: { getItem: () => null, setItem: () => {} }, console, __APP: ND });
  vm.runInContext(lines.slice(0, end2).join("\n") + "\n;globalThis.Q={contList,state,DEPS};", ctx2);
  const Q = ctx2.Q;
  fs.writeFileSync(path.join(tmp, "lowcost.mjs"), fs.readFileSync(path.join(src, "lowcost.js"), "utf8").replace('from "./dati"', 'from "./dati.mjs"').replace('from "./calcoli"', 'from "./calcoli.mjs"'));
  const LC = await import(path.join(tmp, "lowcost.mjs"));
  let n = 0, bad = 0;
  for (const dep of Q.DEPS) for (let month = 1; month <= 12; month++) for (const cap of [150, 300, 900]) for (const nights of [2, 4]) for (const cont of ["italia", "europa", "mondo"]) {
    Object.assign(Q.state, { from: dep.id, profile: "coppia", people: 2, kids: 0, kidsAges: [], tm: "auto", fc: true });
    Q.state.lc = { month, cap, nights };
    const date = `2027-${String(month).padStart(2, "0")}-15`;
    const a = Q.contList(cont, cap, date, nights, 4).map(x => [x.r.d.id, x.r.pp, x.reason, x.badge]);
    const b = LC.contList(cont, cap, date, nights, 4, { ...Q.state }, month).map(x => [x.r.d.id, x.r.pp, x.reason, x.badge]);
    n++; if (JSON.stringify(a) !== JSON.stringify(b)) { bad++; if (bad < 4) console.log("Low cost diverso:", dep.id, month, cap, nights, cont); }
  }
  console.log(`Proposte low cost confrontate: ${n}` + (bad ? `, DIFFERENZE: ${bad}` : ", nessuna differenza."));
  if (bad) process.exit(1);
}

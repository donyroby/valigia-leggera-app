// Itinerari su misura scritti da Claude: temi, regole d'uso e chiave di un itinerario.
// File senza segreti: si usa sia sul server sia nel browser.
export const TEMI = [
  ["classico", "Luoghi da visitare"], ["enogastronomico", "Enogastronomico"], ["natura", "Natura"],
  ["relax", "Relax"], ["notte", "Vita notturna"], ["bambini", "Con bambini"],
];
export const ETICHETTA_PULSANTE = {
  classico: "Crea itinerario su misura", enogastronomico: "Crea itinerario enogastronomico", natura: "Crea itinerario natura",
  relax: "Crea itinerario relax", notte: "Crea itinerario vita notturna", bambini: "Crea itinerario per bambini",
};
export const GRATUITI = 3; // itinerari gratuiti per account, in tutto
export const PREMIUM_AL_GIORNO = 20; // tetto di sicurezza per gli account premium

// "Con bambini" non si sceglie più: se nella ricerca ci sono bambini è sempre incluso (vedi prompt.js)
export const TEMI_SCELTA = TEMI.filter(([k]) => k !== "bambini");

export function temiValidi(t) {
  const ok = (Array.isArray(t) ? t : []).filter((x) => TEMI_SCELTA.some(([k]) => k === x));
  const unici = [...new Set(ok)].slice(0, 2);
  return unici.length ? unici : ["classico"];
}

// Stesso viaggio (meta, notti, profilo, mese) e stessi temi = stesso itinerario
// Con i bambini conta anche la loro età (un itinerario per 3 anni non va bene per 12)
export const etaBambini = (p) => (p.kids > 0 ? (p.kidsAges || []).slice(0, p.kids) : []);
export const chiaveItinerario = (destId, p, temi) => {
  const k = etaBambini(p);
  return ["v1", destId, p.nights, p.profile, p.date.slice(0, 7), temiValidi(temi).slice().sort().join("+"), ...(k.length ? ["b" + k.join("-")] : [])].join("|");
};

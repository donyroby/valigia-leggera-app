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

export function temiValidi(t) {
  const ok = (Array.isArray(t) ? t : []).filter((x) => TEMI.some(([k]) => k === x));
  const unici = [...new Set(ok)].slice(0, 2);
  return unici.length ? unici : ["classico"];
}

// Stesso viaggio (meta, notti, profilo, mese) e stessi temi = stesso itinerario
export const chiaveItinerario = (destId, p, temi) =>
  ["v1", destId, p.nights, p.profile, p.date.slice(0, 7), temiValidi(temi).slice().sort().join("+")].join("|");

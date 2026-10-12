// Codici città usati da Aviasales per le grandi città con più aeroporti.
// File senza segreti: si può usare sia sul server sia nel browser.
const CITTA = {
  CDG: "PAR", FCO: "ROM", MXP: "MIL", BGY: "MIL", LHR: "LON", JFK: "NYC", NRT: "TYO", GIG: "RIO",
  EZE: "BUE", ICN: "SEL", PEK: "BJS", ARN: "STO", OTP: "BUH", TFS: "TCI", YYZ: "YTO",
};
export const codiceCitta = (iata) => CITTA[iata] || iata;

// Il volo reale di una meta, dentro la mappa restituita dal server (chiavi: aeroporto o codice città)
export const voloDellaMeta = (voli, d) => (voli ? voli[d.iata] || voli[codiceCitta(d.iata)] || null : null);

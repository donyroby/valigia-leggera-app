// Nomi delle compagnie più comuni dall'Italia (codice IATA → nome). Se manca, si mostra il codice.
const NOMI = {
  FR: "Ryanair", RK: "Ryanair UK", U2: "easyJet", EC: "easyJet Europe", W6: "Wizz Air", W4: "Wizz Air Malta", AZ: "ITA Airways",
  VY: "Vueling", LH: "Lufthansa", AF: "Air France", KL: "KLM", IB: "Iberia", TP: "TAP Air Portugal", BA: "British Airways",
  LX: "Swiss", OS: "Austrian", A3: "Aegean", TK: "Turkish Airlines", EK: "Emirates", V7: "Volotea", HV: "Transavia",
  TO: "Transavia France", SN: "Brussels Airlines", EW: "Eurowings", DY: "Norwegian", D8: "Norwegian", SK: "SAS", AY: "Finnair",
  LO: "LOT", JU: "Air Serbia", OU: "Croatia Airlines", PC: "Pegasus", QR: "Qatar Airways", UX: "Air Europa", EI: "Aer Lingus",
  BT: "airBaltic", RO: "Tarom", FB: "Bulgaria Air", LG: "Luxair", EN: "Air Dolomiti", DE: "Condor", "4U": "Eurowings",
  XQ: "SunExpress", KM: "KM Malta Airlines", AT: "Royal Air Maroc", MS: "EgyptAir", LY: "El Al", EY: "Etihad", DL: "Delta",
  UA: "United", AA: "American Airlines", AC: "Air Canada",
};
export const nomeCompagnia = (c) => (c ? NOMI[c] || c : null);

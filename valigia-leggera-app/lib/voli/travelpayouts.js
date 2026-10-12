// Prezzi reali dei voli dai dati di Travelpayouts/Aviasales.
// SOLO SERVER: usa il token segreto TRAVELPAYOUTS_TOKEN, che non deve mai arrivare al browser.
// I dati sono i prezzi trovati di recente dagli utenti di Aviasales (conservati da 2 a 7 giorni):
// sono prezzi veri, ma non una prenotazione garantita.

// TRAVELPAYOUTS_API_URL serve solo per le prove in locale con dati finti; online non va impostata.
const API = process.env.TRAVELPAYOUTS_API_URL || "https://api.travelpayouts.com/aviasales/v3/prices_for_dates";
const CACHE_SECONDI = 6 * 60 * 60; // ogni rotta viene richiesta al massimo ogni 6 ore

// Per le grandi città Aviasales ragiona per codice città (più aeroporti insieme, più offerte).
// I nostri dati usano spesso il codice dell'aeroporto principale: qui li traduciamo.
const CITTA = {
  CDG: "PAR", FCO: "ROM", MXP: "MIL", BGY: "MIL", LHR: "LON", JFK: "NYC", NRT: "TYO", GIG: "RIO",
  EZE: "BUE", ICN: "SEL", PEK: "BJS", ARN: "STO", OTP: "BUH", TFS: "TCI", YYZ: "YTO",
};
export const codiceCitta = (iata) => CITTA[iata] || iata;

export const tokenPresente = () => Boolean(process.env.TRAVELPAYOUTS_TOKEN);

async function chiama(params) {
  const token = process.env.TRAVELPAYOUTS_TOKEN;
  if (!token) return { ok: false, motivo: "token_mancante", data: [] };
  const q = new URLSearchParams({ currency: "eur", sorting: "price", ...params });
  try {
    const res = await fetch(`${API}?${q}`, {
      headers: { "X-Access-Token": token, "Accept-Encoding": "gzip, deflate" },
      next: { revalidate: CACHE_SECONDI },
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return { ok: false, motivo: "http_" + res.status, data: [] };
    const json = await res.json();
    if (json && json.success === false) return { ok: false, motivo: "risposta_" + (json.error || "errore"), data: [] };
    return { ok: true, data: Array.isArray(json?.data) ? json.data : [] };
  } catch (e) {
    return { ok: false, motivo: e?.name === "TimeoutError" ? "tempo_scaduto" : "rete", data: [] };
  }
}

const giorno = (s) => (typeof s === "string" ? s.slice(0, 10) : "");
const notti = (a, b) => Math.round((new Date(giorno(b) + "T12:00:00") - new Date(giorno(a) + "T12:00:00")) / 864e5);

function normalizza(v) {
  const price = Number(v.price ?? v.value);
  if (!Number.isFinite(price) || price <= 0) return null;
  return {
    prezzo: Math.round(price), // andata e ritorno, a persona (adulto)
    andata: giorno(v.departure_at), ritorno: giorno(v.return_at),
    compagnia: v.airline || null, volo: v.flight_number ? String(v.flight_number) : null,
    scaliAndata: Number.isFinite(v.transfers) ? v.transfers : null,
    scaliRitorno: Number.isFinite(v.return_transfers) ? v.return_transfers : null,
    origine: v.origin_airport || v.origin, destinazione: v.destination_airport || v.destination,
    cittaDestinazione: v.destination,
  };
}

// Volo reale per una tratta e delle date precise. Se per quelle date non c'è nulla,
// cerca nello stesso mese un volo di durata simile (±2 notti) e lo segnala come "date vicine".
export async function voloPerDate({ da, a, andata, ritorno }) {
  const dest = codiceCitta(a);
  const esatto = await chiama({ origin: da, destination: dest, departure_at: andata, return_at: ritorno, one_way: "false", limit: "5" });
  const primo = esatto.data.map(normalizza).find(Boolean);
  if (primo) return { ok: true, tipo: "date_esatte", volo: primo };
  if (!esatto.ok) return { ok: false, motivo: esatto.motivo };

  const n = notti(andata, ritorno);
  const mese = await chiama({ origin: da, destination: dest, departure_at: andata.slice(0, 7), return_at: ritorno.slice(0, 7), one_way: "false", limit: "30" });
  const vicino = mese.data.map(normalizza).filter(Boolean)
    .filter((v) => v.andata && v.ritorno && Math.abs(notti(v.andata, v.ritorno) - n) <= 2)
    .sort((x, y) => x.prezzo - y.prezzo)[0];
  if (vicino) return { ok: true, tipo: "date_vicine", volo: vicino };
  return { ok: mese.ok, motivo: mese.ok ? "nessun_volo" : mese.motivo };
}

// Le destinazioni più economiche da un aeroporto, andata e ritorno, nel mese indicato (AAAA-MM).
export async function offerteDa(da, mese) {
  const r = await chiama({ origin: da, departure_at: mese, return_at: mese, one_way: "false", unique: "true", limit: "100" });
  return { ok: r.ok, motivo: r.motivo, voli: r.data.map(normalizza).filter(Boolean) };
}

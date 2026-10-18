// Funzione Netlify in background (fino a 15 minuti): scrive l'itinerario con Claude e lo salva.
// La avvia il browser con il "lavoro" firmato dal sito (app/api/itinerario/route.js).
// Il browser riceve subito 202; il risultato lo legge poi dal sito (GET /api/itinerario?lavoro=…).
// Accesso a Supabase con il token dell'utente: valgono le stesse regole (RLS) del sito.
import { verifica } from "../../lib/itinerari/firma.mjs";
import { leggiItinerario, giorniParziali } from "../../lib/itinerari/leggi.mjs";
import { SCHEMA_ITINERARIO } from "../../lib/itinerari/schema.mjs";

const MODELLO = "claude-sonnet-5-5";
const GRATUITI = 3; // come lib/itinerari/temi.js
const PREZZO_IN = 2 / 1e6, PREZZO_OUT = 10 / 1e6; // Sonnet 5.5, dollari per token (ingresso / uscita)

// Email di avviso a Donato via Brevo (BREVO_API_KEY e ALLARME_EMAIL nelle variabili di Netlify)
async function avvisa(oggetto, testo) {
  const key = process.env.BREVO_API_KEY, a = process.env.ALLARME_EMAIL;
  if (!key || !a) { console.error("Avviso non inviato: mancano BREVO_API_KEY o ALLARME_EMAIL", oggetto); return; }
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Valigia Leggera", email: process.env.ALLARME_MITTENTE || "info@valigialeggera.it" },
      to: [{ email: a }], subject: oggetto,
      htmlContent: `<p>${testo}</p><p>Ricarica su <a href="https://platform.claude.com">platform.claude.com</a>, poi aggiorna il credito su Supabase (SQL nel file valigia-leggera-avviso-credito.sql).</p>`,
    }),
  }).catch((e) => ({ ok: false, status: String(e) }));
  if (!r.ok) console.error("Avviso non inviato", r.status, await r.text?.().catch(() => ""));
  else console.log("Avviso inviato", oggetto);
}

// Brevo disattiva le chiavi dopo 90 giorni senza uso: a ogni itinerario una lettura innocua la tiene attiva
async function tieniVivaBrevo() {
  const key = process.env.BREVO_API_KEY;
  if (!key) return;
  const r = await fetch("https://api.brevo.com/v3/account", { headers: { "api-key": key, accept: "application/json" } }).catch(() => null);
  if (!r?.ok) console.error("Chiave Brevo non valida o scaduta: gli avvisi sul credito non partirebbero", r?.status);
}

export default async (req) => {
  try {
    await esegui(req);
  } catch (e) {
    console.error("Itinerario: errore imprevisto", String(e?.stack || e).slice(0, 500));
  }
  // Niente eccezioni verso Netlify: altrimenti ripeterebbe la funzione (e la chiamata a Claude)
};

async function esegui(req) {
  let corpo;
  try { corpo = await req.json(); } catch { return; }
  if (!verifica(corpo?.dati, corpo?.firma)) { console.error("Itinerario: firma non valida"); return; }
  const L = JSON.parse(corpo.dati);
  if (Date.now() > L.scade) { console.error("Itinerario: lavoro scaduto"); return; }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL + "/rest/v1/";
  const db = (percorso, init = {}) => fetch(base + percorso, {
    ...init,
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, Authorization: "Bearer " + L.token, "Content-Type": "application/json", ...(init.headers || {}) },
  });
  const segna = (campi) => db(`itinerari_lavori?id=eq.${L.lavoro}`, { method: "PATCH", body: JSON.stringify(campi) }).catch(() => {});
  const fallisci = async (codice, info) => { console.error("Itinerario non creato", { codice, ...info }); await segna({ stato: "errore", codice }); };

  // Prende in carico il lavoro solo se nessuno l'ha già fatto (così non si può avviare due volte)
  const presa = await db(`itinerari_lavori?id=eq.${L.lavoro}&stato=eq.nuovo`, {
    method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ stato: "in_corso" }),
  });
  const righe = presa.ok ? await presa.json() : [];
  if (!righe.length) { console.error("Itinerario: lavoro già avviato o inesistente", presa.status); return; }

  // Ricontrollo dei gratuiti (nel frattempo potrebbe averne creati altri)
  if (!L.premium) {
    const c = await db(`itinerari?select=id&user_id=eq.${L.uid}`, { method: "HEAD", headers: { Prefer: "count=exact" } });
    const n = Number((c.headers.get("content-range") || "").split("/")[1] || 0);
    if (n >= GRATUITI) return fallisci("limite", { n });
  }

  // Claude, con un secondo tentativo se è sovraccarico
  const t0 = Date.now();
  let risposta, tentativo = 0;
  for (;;) {
    tentativo++;
    try {
      risposta = await fetch(process.env.ANTHROPIC_API_URL || "https://api.anthropic.com/v1/messages", { // ANTHROPIC_API_URL solo per prove in locale
        method: "POST",
        signal: AbortSignal.timeout(180000),
        headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
        // Niente ragionamento iniziale ("between_tools"), impegno medio e risposta vincolata allo schema JSON:
        // senza, Sonnet 5.5 pensa o fa la brutta copia nel testo (~9000 token, ~60 s) prima del JSON
        body: JSON.stringify({
          model: MODELLO, max_tokens: 8000, stream: true,
          thinking: { type: "between_tools" },
          output_config: { effort: "medium", format: { type: "json_schema", schema: SCHEMA_ITINERARIO } },
          messages: [{ role: "user", content: L.prompt }],
        }),
      });
    } catch (e) {
      return fallisci(e?.name === "TimeoutError" ? "tempo" : "rete", { errore: String(e).slice(0, 200) });
    }
    const sovraccarico = risposta.status === 429 || risposta.status === 529 || risposta.status >= 500;
    if (sovraccarico && tentativo === 1) { await new Promise((r) => setTimeout(r, 8000)); continue; }
    break;
  }
  if (!risposta.ok || !risposta.body) {
    const testo = (await risposta.text().catch(() => "")).slice(0, 300);
    const codice = risposta.status === 429 || risposta.status === 529 ? "occupato" : /credit/i.test(testo) ? "credito" : `api_${risposta.status}`;
    if (codice === "credito") {
      const prima = await db("rpc/segnala_credito_finito", { method: "POST", body: "{}" }).then((r) => r.json()).catch(() => false);
      if (prima === true) await avvisa("Valigia Leggera: credito Anthropic ESAURITO", "Il credito Anthropic è finito: gli itinerari su misura non funzionano finché non ricarichi.");
    }
    return fallisci(codice, { http: risposta.status, testo });
  }

  // Legge il testo man mano: ogni giorno completo viene salvato subito nel lavoro, così il sito lo mostra
  let testo = "", motivo = null, erroreStream = null, mostrati = 0, tokenUscita = null, tokenIngresso = null, primoTesto = null;
  try {
    const reader = risposta.body.getReader(), dec = new TextDecoder();
    let buf = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf("\n\n")) >= 0) {
        const blocco = buf.slice(0, i); buf = buf.slice(i + 2);
        const riga = blocco.split("\n").find((l) => l.startsWith("data:"));
        if (!riga) continue;
        let ev; try { ev = JSON.parse(riga.slice(5)); } catch { continue; }
        if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") { testo += ev.delta.text; primoTesto ??= Math.round((Date.now() - t0) / 1000); }
        else if (ev.type === "message_start") tokenIngresso = ev.message?.usage?.input_tokens ?? null;
        else if (ev.type === "message_delta") { motivo = ev.delta?.stop_reason || motivo; tokenUscita = ev.usage?.output_tokens ?? tokenUscita; }
        else if (ev.type === "error") erroreStream = ev.error;
      }
      const giorni = giorniParziali(testo);
      if (giorni.length > mostrati) { mostrati = giorni.length; await segna({ parziale: { days: giorni } }); }
    }
  } catch (e) {
    return fallisci(e?.name === "TimeoutError" ? "tempo" : "interrotto", { errore: String(e).slice(0, 200), caratteri: testo.length });
  }
  const secondi = Math.round((Date.now() - t0) / 1000);
  await registraCosto(db, tokenIngresso, tokenUscita);
  if (erroreStream) return fallisci(erroreStream.type === "overloaded_error" ? "occupato" : "interrotto", { secondi, errore: JSON.stringify(erroreStream).slice(0, 300) });
  const dati = leggiItinerario(testo);
  if (!dati) return fallisci(motivo === "max_tokens" ? "lungo" : "lettura", { secondi, motivo, inizio: testo.slice(0, 200), fine: testo.slice(-200) });

  const salva = await db("itinerari", { method: "POST", body: JSON.stringify({ user_id: L.uid, chiave: L.chiave, dest_id: L.dest, temi: L.temi, dati }) });
  if (!salva.ok) return fallisci("salvataggio", { http: salva.status, testo: (await salva.text().catch(() => "")).slice(0, 300) });
  await segna({ stato: "ok" });
  console.log("Itinerario creato", { dest: L.dest, temi: L.temi.join("+"), secondi, primo_testo_dopo: primoTesto, token_uscita: tokenUscita });
}

// Conta quanto è costato e, sotto la soglia (2 $), avvisa una volta sola
async function registraCosto(db, tIn, tOut) {
  if (tOut == null) return;
  const costo = Math.round(((tIn || 0) * PREZZO_IN + tOut * PREZZO_OUT) * 1e5) / 1e5;
  const r = await db("rpc/registra_uso_ai", { method: "POST", body: JSON.stringify({ costo }) }).catch(() => null);
  const esito = r?.ok ? await r.json().catch(() => null) : null;
  if (!esito) { console.error("Costo non registrato", r?.status, costo); return; }
  console.log("Costo itinerario", { costo_usd: costo, credito_rimasto_usd: esito.rimanente });
  await tieniVivaBrevo();
  if (esito.avvisa) await avvisa(`Valigia Leggera: credito Anthropic sotto i 2 $ (restano circa ${esito.rimanente} $)`,
    `Il credito Anthropic stimato è sceso a circa <b>${esito.rimanente} $</b>: bastano ancora per circa ${Math.max(0, Math.floor(esito.rimanente / 0.025))} itinerari.`);
}

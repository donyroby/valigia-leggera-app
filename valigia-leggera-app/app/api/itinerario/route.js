// Itinerari su misura con Claude (Anthropic API).
// Claude impiega 20-60 secondi: troppo per una richiesta normale su Netlify (risponde 504).
// Per questo il lavoro è diviso in tre passi:
//   1. POST qui: controlli (accesso, 3 gratuiti, premium), poi crea un "lavoro" e lo firma;
//   2. il browser passa il lavoro firmato alla funzione in background (netlify/functions/itinerario-background.mjs),
//      che ha fino a 15 minuti, chiama Claude e salva il risultato;
//   3. GET qui: il browser chiede ogni pochi secondi se il lavoro è finito.
import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { ALL } from "@/lib/viaggi/dati";
import { conDettagli } from "@/lib/viaggi/dettagli";
import { daIndirizzo } from "@/lib/viaggi/parametri";
import { itinPrompt } from "@/lib/itinerari/prompt";
import { firma } from "@/lib/itinerari/firma.mjs";
import { chiaveItinerario, temiValidi, GRATUITI, PREMIUM_AL_GIORNO } from "@/lib/itinerari/temi";

const json = (body, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const SCADENZA_AVVIO = 2 * 60 * 1000; // il lavoro firmato va avviato entro 2 minuti
const ATTESA_MASSIMA = 3 * 60 * 1000; // oltre, un lavoro ancora in corso si considera perso

async function contaUsati(supabase, userId) {
  const { count } = await supabase.from("itinerari").select("id", { count: "exact", head: true }).eq("user_id", userId);
  return count ?? 0;
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return json({ codice: "richiesta" }, 400); }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return json({ codice: "accedi" }, 401);

  const d = conDettagli(ALL.find((x) => x.id === body?.destId));
  if (!d) return json({ codice: "meta" }, 404);
  const p = daIndirizzo(Object.fromEntries(new URLSearchParams(typeof body.qs === "string" ? body.qs : "")));
  const temi = temiValidi(body.temi);
  const chiave = chiaveItinerario(d.id, p, temi);

  // Già creato e non si chiede di rigenerarlo: lo restituisce senza consumare
  if (body.rigenera !== true) {
    const { data: esistente } = await supabase.from("itinerari").select("dati").eq("user_id", user.id).eq("chiave", chiave).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (esistente) return json({ dati: esistente.dati, giaPronto: true });
  }

  // Quanti ne ha già creati e se è premium
  const [usati, { data: prem }] = await Promise.all([
    contaUsati(supabase, user.id),
    supabase.from("premium").select("user_id").eq("user_id", user.id).maybeSingle(),
  ]);
  if (!prem && usati >= GRATUITI) return json({ codice: "limite", usati }, 402);
  if (prem) {
    const oggi = new Date(); oggi.setUTCHours(0, 0, 0, 0);
    const { count: oggiN } = await supabase.from("itinerari").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", oggi.toISOString());
    if ((oggiN ?? 0) >= PREMIUM_AL_GIORNO) return json({ codice: "troppi" }, 429);
  }

  if (!process.env.ANTHROPIC_API_KEY) return json({ codice: "non_attivo" }, 503);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return json({ codice: "accedi" }, 401);

  // Il lavoro: la riga serve al browser per sapere quando è finito, e impedisce di avviarlo due volte
  const lavoro = randomUUID();
  const { error } = await supabase.from("itinerari_lavori").insert({ id: lavoro, user_id: user.id, chiave });
  if (error) { console.error("Lavoro itinerario", error.message); return json({ codice: "servizio" }, 500); }

  const dati = JSON.stringify({
    lavoro, uid: user.id, chiave, dest: d.id, temi, premium: !!prem,
    prompt: itinPrompt(d, p, temi), token: session.access_token, scade: Date.now() + SCADENZA_AVVIO,
  });
  return json({ lavoro, avvio: { dati, firma: firma(dati) } });
}

// Stato di un lavoro: in_corso | ok (con l'itinerario) | errore (con il codice)
export async function GET(request) {
  const lavoro = new URL(request.url).searchParams.get("lavoro") || "";
  if (!/^[0-9a-f-]{36}$/.test(lavoro)) return json({ codice: "richiesta" }, 400);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return json({ codice: "accedi" }, 401);

  const { data: riga } = await supabase.from("itinerari_lavori").select("chiave, stato, codice, parziale, created_at").eq("id", lavoro).maybeSingle();
  if (!riga) return json({ stato: "errore", codice: "lavoro" });
  if (riga.stato === "errore") return json({ stato: "errore", codice: riga.codice || "servizio" });
  if (riga.stato === "ok") {
    const [{ data: it }, usati] = await Promise.all([
      supabase.from("itinerari").select("dati").eq("user_id", user.id).eq("chiave", riga.chiave).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      contaUsati(supabase, user.id),
    ]);
    if (it) return json({ stato: "ok", dati: it.dati, usati });
    return json({ stato: "errore", codice: "salvataggio" });
  }
  if (Date.now() - new Date(riga.created_at).getTime() > ATTESA_MASSIMA) return json({ stato: "errore", codice: "tempo" });
  return json({ stato: riga.stato, parziale: riga.parziale?.days || null }); // nuovo (non ancora partito) oppure in_corso, con i giorni già pronti
}

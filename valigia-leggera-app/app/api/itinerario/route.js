// Crea un itinerario su misura con Claude (Anthropic API) e lo salva nell'account.
// Regole: serve l'accesso; 3 itinerari gratuiti in tutto per account, poi premium (tabella premium).
// La risposta è uno stream di righe JSON: {"t":"avanzo","n":caratteri} durante la scrittura,
// poi {"t":"ok","dati":...,"usati":n} oppure {"t":"errore","codice":"..."}.
import { createClient } from "@/lib/supabase/server";
import { ALL } from "@/lib/viaggi/dati";
import { conDettagli } from "@/lib/viaggi/dettagli";
import { daIndirizzo } from "@/lib/viaggi/parametri";
import { itinPrompt, leggiItinerario } from "@/lib/itinerari/prompt";
import { chiaveItinerario, temiValidi, GRATUITI, PREMIUM_AL_GIORNO } from "@/lib/itinerari/temi";

export const maxDuration = 60;

const MODELLO = "claude-sonnet-5-5";
const json = (body, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

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
  const rigenera = body.rigenera === true;

  // Già creato e non si chiede di rigenerarlo: lo restituisce senza consumare
  if (!rigenera) {
    const { data: esistente } = await supabase.from("itinerari").select("dati").eq("user_id", user.id).eq("chiave", chiave).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (esistente) return json({ dati: esistente.dati, giaPronto: true });
  }

  // Quanti ne ha già creati e se è premium
  const [{ count: usati }, { data: prem }] = await Promise.all([
    supabase.from("itinerari").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("premium").select("user_id").eq("user_id", user.id).maybeSingle(),
  ]);
  if (!prem && (usati ?? 0) >= GRATUITI) return json({ codice: "limite", usati }, 402);
  if (prem) {
    const oggi = new Date(); oggi.setUTCHours(0, 0, 0, 0);
    const { count: oggiN } = await supabase.from("itinerari").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", oggi.toISOString());
    if ((oggiN ?? 0) >= PREMIUM_AL_GIORNO) return json({ codice: "troppi" }, 429);
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return json({ codice: "non_attivo" }, 503);

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 55000);
  let risposta;
  try {
    risposta = await fetch(process.env.ANTHROPIC_API_URL || "https://api.anthropic.com/v1/messages", { // ANTHROPIC_API_URL solo per prove in locale
      method: "POST",
      signal: ctl.signal,
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODELLO, max_tokens: 6000, stream: true, messages: [{ role: "user", content: itinPrompt(d, p, temi) }] }),
    });
  } catch {
    clearTimeout(timer);
    return json({ codice: "rete" }, 502);
  }
  if (!risposta.ok || !risposta.body) {
    clearTimeout(timer);
    const codice = risposta.status === 429 || risposta.status === 529 ? "occupato" : risposta.status === 400 || risposta.status === 402 ? "credito" : "servizio";
    console.error("Anthropic API", risposta.status, (await risposta.text().catch(() => "")).slice(0, 300));
    return json({ codice }, 502);
  }

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const manda = (o) => controller.enqueue(enc.encode(JSON.stringify(o) + "\n"));
      const reader = risposta.body.getReader(), dec = new TextDecoder();
      let buf = "", testo = "", ultimo = 0, interrotto = false;
      try {
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
            if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") testo += ev.delta.text;
            if (ev.type === "error") interrotto = true;
          }
          if (testo.length - ultimo > 200) { ultimo = testo.length; manda({ t: "avanzo", n: testo.length }); }
        }
      } catch {
        interrotto = true;
      } finally {
        clearTimeout(timer);
      }
      const dati = interrotto ? null : leggiItinerario(testo);
      if (!dati) { manda({ t: "errore", codice: interrotto ? "interrotto" : "lettura" }); controller.close(); return; }
      const { error } = await supabase.from("itinerari").insert({ user_id: user.id, chiave, dest_id: d.id, temi, dati });
      if (error) console.error("Salvataggio itinerario", error.message);
      manda({ t: "ok", dati, usati: (usati ?? 0) + 1, premium: !!prem });
      controller.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}

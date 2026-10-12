import { DEPS } from "@/lib/viaggi/dati";
import { voliPerRicerca } from "@/lib/voli/travelpayouts";

// Prezzi reali dei voli per la pagina di ricerca: partenza e date → volo più economico per ogni destinazione.
// La risposta viene tenuta in cache dalla rete di Netlify per 6 ore, così ogni combinazione costa una sola chiamata.
const data = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

export async function GET(request) {
  const q = new URL(request.url).searchParams;
  const da = q.get("da"), andata = q.get("andata"), ritorno = q.get("ritorno");
  if (!DEPS.some((x) => x.id === da) || !data(andata) || !data(ritorno) || ritorno <= andata) {
    return Response.json({ ok: false, motivo: "parametri", voli: {} }, { status: 400 });
  }
  const r = await voliPerRicerca({ da, andata, ritorno });
  return Response.json(r, {
    headers: { "Cache-Control": r.ok ? "public, max-age=900, s-maxage=21600, stale-while-revalidate=86400" : "no-store" },
  });
}

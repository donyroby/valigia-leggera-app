// Firma del "lavoro" di un itinerario: il sito autorizza, la funzione in background esegue.
// Senza firma valida la funzione non chiama Claude, così nessuno può usarla per richieste proprie.
// Senza import "@/": lo usa anche la funzione Netlify in background.
import { createHmac, timingSafeEqual } from "node:crypto";

const segreto = () => {
  const k = process.env.ANTHROPIC_API_KEY;
  if (!k) throw new Error("ANTHROPIC_API_KEY mancante");
  return createHmac("sha256", "valigia-leggera/itinerari").update(k).digest();
};

export const firma = (testo) => createHmac("sha256", segreto()).update(testo).digest("base64url");

export function verifica(testo, f) {
  if (typeof testo !== "string" || typeof f !== "string") return false;
  const a = Buffer.from(firma(testo)), b = Buffer.from(f);
  return a.length === b.length && timingSafeEqual(a, b);
}

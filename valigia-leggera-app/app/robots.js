// Indicazioni per i motori di ricerca. Le pagine personali non vanno indicizzate.
import { NASCOSTO_AI_MOTORI } from "@/lib/lancio";
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/profilo", "/viaggi", "/salvadanaio", "/auth/", "/accedi"] }],
    // Prima del lancio niente mappa del sito: i motori non devono cercare le pagine
    ...(NASCOSTO_AI_MOTORI ? {} : { sitemap: "https://valigialeggera.it/sitemap.xml" }),
  };
}

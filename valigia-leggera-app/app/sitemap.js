import { ALL } from "@/lib/viaggi/dati";

// Elenco delle pagine pubbliche per i motori di ricerca, comprese le schede di tutte le mete
export default function sitemap() {
  const base = "https://valigialeggera.it";
  const fisse = ["", "/lowcost", "/privacy", "/cookie", "/termini", "/affiliazioni"].map((p) => ({
    url: base + p, changeFrequency: p === "" || p === "/lowcost" ? "weekly" : "yearly", priority: p === "" ? 1 : 0.5,
  }));
  const mete = ALL.map((d) => ({ url: `${base}/meta/${d.id}`, changeFrequency: "monthly", priority: 0.7 }));
  return [...fisse, ...mete];
}

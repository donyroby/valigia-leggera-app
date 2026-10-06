// Indicazioni per i motori di ricerca. Le pagine personali non vanno indicizzate.
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/profilo", "/viaggi", "/salvadanaio", "/auth/", "/accedi"] }],
    sitemap: "https://valigialeggera.it/sitemap.xml",
  };
}

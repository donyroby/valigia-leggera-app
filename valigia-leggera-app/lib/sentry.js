// Impostazioni comuni degli avvisi errori (Sentry). Il codice DSN non è segreto: sta in Netlify
// come NEXT_PUBLIC_SENTRY_DSN. Se manca, gli avvisi restano spenti e il sito funziona uguale.
export const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

export const opzioniSentry = {
  dsn: DSN,
  sendDefaultPii: false, // niente indirizzi IP, cookie o dati dell'utente
  tracesSampleRate: 0, // solo errori, nessuna misura delle prestazioni
  environment: process.env.NODE_ENV,
  // Toglie dagli indirizzi i parametri (es. il codice del link magico) prima dell'invio
  beforeSend(evento) {
    if (evento.request) {
      if (evento.request.url) evento.request.url = evento.request.url.split("?")[0];
      delete evento.request.query_string;
      delete evento.request.cookies;
      delete evento.request.headers;
    }
    return evento;
  },
  beforeBreadcrumb(b) {
    if (b?.data?.url) b.data.url = String(b.data.url).split("?")[0];
    if (b?.data?.to) b.data.to = String(b.data.to).split("?")[0];
    if (b?.data?.from) b.data.from = String(b.data.from).split("?")[0];
    return b;
  },
};

// Eventi per GoatCounter: solo conteggi anonimi (nessun cookie, nessun dato personale, niente memoria del browser).
// Su GoatCounter compaiono nella sezione "Events" con il nome qui sotto.
export function evento(nome, titolo) {
  try {
    if (typeof window === "undefined" || !window.location.hostname.endsWith("valigialeggera.it")) return;
    window.goatcounter?.count?.({ path: nome, title: titolo || nome, event: true });
  } catch {}
}

"use client";
// Pagina mostrata se si rompe qualcosa di grave: avvisa Sentry e propone di riprovare.
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => { Sentry.captureException(error); }, [error]);
  return (
    <html lang="it">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "48px 16px", textAlign: "center", background: "#EDF3F5", color: "#0A1B2D" }}>
        <h1 style={{ fontSize: 28 }}>Ops, qualcosa è andato storto</h1>
        <p>Abbiamo ricevuto la segnalazione e ci stiamo guardando.</p>
        <p style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => reset()} style={{ padding: "10px 18px", borderRadius: 10, border: 0, background: "#0A1B2D", color: "#fff", fontSize: 16, cursor: "pointer" }}>Riprova</button>
          <a href="/" style={{ padding: "10px 18px", color: "#0A1B2D" }}>Torna alla home</a>
        </p>
      </body>
    </html>
  );
}

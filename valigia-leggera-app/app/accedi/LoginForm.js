"use client";
// Accesso: "Continua con Google" oppure codice via email (con il link, per chi preferisce cliccare).
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const G = (
  <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
    <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z" />
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
  </svg>
);

export default function LoginForm({ next = "/profilo" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [codice, setCodice] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | verifying | error
  const [message, setMessage] = useState("");
  const callback = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  async function google() {
    setMessage("");
    const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback() } });
    if (error) { setStatus("error"); setMessage("L'accesso con Google non è disponibile in questo momento. Usa la tua email qui sotto."); }
  }

  async function invia(event) {
    event?.preventDefault();
    setStatus("sending");
    setMessage("");
    const { error } = await createClient().auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: callback() } });
    if (error) {
      setStatus("error");
      setMessage(error.status === 429
        ? "Hai chiesto troppi codici in poco tempo. Aspetta qualche minuto e riprova."
        : "Non siamo riusciti a mandare l'email. Controlla l'indirizzo e riprova.");
      return;
    }
    setCodice("");
    setStatus("sent");
  }

  async function verifica(event) {
    event.preventDefault();
    setStatus("verifying");
    setMessage("");
    const { error } = await createClient().auth.verifyOtp({ email: email.trim(), token: codice.replace(/\D/g, ""), type: "email" });
    if (error) {
      setStatus("sent");
      setMessage("Il codice non è corretto o è scaduto. Controlla l'ultima email ricevuta oppure chiedine uno nuovo.");
      return;
    }
    router.replace(next);
    router.refresh();
  }

  if (status === "sent" || status === "verifying") {
    return (
      <form className="form" onSubmit={verifica}>
        <p role="status" style={{ margin: 0 }}>
          Ti abbiamo mandato un&apos;email a <strong>{email.trim()}</strong> con un <strong>codice</strong>.
          Scrivilo qui sotto: funziona anche se apri l&apos;email da un altro dispositivo.
        </p>
        <label htmlFor="codice">Codice ricevuto via email</label>
        <input
          id="codice" type="text" inputMode="numeric" autoComplete="one-time-code" required
          pattern="[0-9 ]{6,12}" maxLength={12} placeholder="123456" className="codice"
          value={codice} onChange={(e) => setCodice(e.target.value)} autoFocus
        />
        <button className="btn" type="submit" disabled={status === "verifying"}>
          {status === "verifying" ? "Verifica…" : "Entra"}
        </button>
        {message && <p className="alert" role="alert">{message}</p>}
        <p className="consenso">
          Nell&apos;email c&apos;è anche un link: se preferisci, cliccalo da questo stesso browser.
          Non trovi l&apos;email? Guarda nello spam, oppure{" "}
          <button type="button" className="link-button" onClick={invia}>mandami un nuovo codice</button> ·{" "}
          <button type="button" className="link-button" onClick={() => { setStatus("idle"); setMessage(""); }}>usa un&apos;altra email</button>
        </p>
      </form>
    );
  }

  return (
    <div className="form">
      <button type="button" className="btn btn-google" onClick={google}>{G} Continua con Google</button>
      <p className="oppure"><span>oppure con la tua email</span></p>
      <form className="form" onSubmit={invia} style={{ margin: 0 }}>
        <label htmlFor="email">La tua email</label>
        <input
          id="email" type="email" autoComplete="email" required
          value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@esempio.it"
        />
        <button className="btn" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Invio in corso…" : "Mandami il codice"}
        </button>
      </form>
      {status === "error" && <p className="alert" role="alert">{message}</p>}
      <p className="consenso">
        Continuando dichiari di avere almeno 14 anni e di aver letto l&apos;<a href="/privacy">informativa privacy</a> e
        i <a href="/termini">termini d&apos;uso</a>.
      </p>
    </div>
  );
}

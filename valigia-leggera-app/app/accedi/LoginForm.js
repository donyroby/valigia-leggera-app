"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/profilo`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(
        error.status === 429
          ? "Hai chiesto troppi link in poco tempo. Aspetta qualche minuto e riprova."
          : "Non siamo riusciti a mandare il link. Controlla l'indirizzo e riprova."
      );
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="sent" role="status">
        <p>
          Link inviato a <strong>{email.trim()}</strong>. Aprilo da questo stesso
          browser per entrare. Se non lo vedi entro qualche minuto, guarda nella
          cartella spam.
        </p>
        <button type="button" className="link-button" onClick={() => setStatus("idle")}>
          Usa un&apos;altra email
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label htmlFor="email">La tua email</label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="nome@esempio.it"
      />
      <button className="btn" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Invio in corso…" : "Mandami il link"}
      </button>
      {status === "error" && (
        <p className="alert" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}

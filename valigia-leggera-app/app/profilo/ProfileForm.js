"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const PROFILES = [
  { value: "amici", label: "Con gli amici" },
  { value: "coppia", label: "In coppia" },
  { value: "famiglia", label: "In famiglia" },
];

export default function ProfileForm({ userId, initialName, initialProfile, isNew }) {
  const [name, setName] = useState(initialName);
  const [profile, setProfile] = useState(initialProfile);
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("saving");
    const supabase = createClient();
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      display_name: name.trim() || null,
      default_profile: profile,
    });
    setStatus(error ? "error" : "saved");
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {isNew && status !== "saved" && (
        <p className="hint">Primo accesso: dicci come chiamarti e con chi viaggi di solito.</p>
      )}
      <label htmlFor="name">Come ti chiamiamo</label>
      <input
        id="name"
        type="text"
        autoComplete="given-name"
        maxLength={60}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setStatus("idle");
        }}
        placeholder="Il tuo nome"
      />
      <fieldset>
        <legend>Di solito viaggi</legend>
        <div className="choices">
          {PROFILES.map((p) => (
            <label key={p.value} className="choice">
              <input
                type="radio"
                name="profile"
                value={p.value}
                checked={profile === p.value}
                onChange={() => {
                  setProfile(p.value);
                  setStatus("idle");
                }}
              />
              <span>{p.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <button className="btn" type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Salvataggio…" : "Salva il profilo"}
      </button>
      {status === "saved" && (
        <p className="ok" role="status">
          Profilo salvato.
        </p>
      )}
      {status === "error" && (
        <p className="alert" role="alert">
          Il profilo non è stato salvato. Ricarica la pagina e riprova.
        </p>
      )}
    </form>
  );
}

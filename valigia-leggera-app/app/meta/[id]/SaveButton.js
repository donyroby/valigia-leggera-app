"use client";

import { useState } from "react";
import Link from "next/link";
import s from "@/components/viaggi.module.css";
import { createClient } from "@/lib/supabase/client";
import { ALL } from "@/lib/viaggi/dati";
import { versoRiga } from "@/lib/viaggi/parametri";

export default function SaveButton({ loggedIn, savedId, destId, params, pp, budget, here }) {
  const [id, setId] = useState(savedId);
  const [status, setStatus] = useState("idle"); // idle | busy | error

  if (!loggedIn) {
    return (
      <div>
        <Link className={s.btn} href={`/accedi?next=${encodeURIComponent(here)}`}>Accedi per salvare il viaggio</Link>
        <p className={s.saveNote}>Con l&apos;account ritrovi i viaggi salvati su qualsiasi dispositivo.</p>
      </div>
    );
  }

  async function salva() {
    setStatus("busy");
    const d = ALL.find((x) => x.id === destId);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setStatus("error"); return; }
    const { data, error } = await supabase
      .from("saved_trips")
      .insert({ ...versoRiga(d, params, pp, budget), user_id: user.id })
      .select("id")
      .single();
    if (error) { setStatus("error"); return; }
    setId(data.id); setStatus("idle");
  }

  async function rimuovi() {
    setStatus("busy");
    const { error } = await createClient().from("saved_trips").delete().eq("id", id);
    if (error) { setStatus("error"); return; }
    setId(null); setStatus("idle");
  }

  return (
    <div className={s.saveRow} aria-live="polite">
      {id ? (
        <>
          <span className={`${s.status} ${s.ok}`}>Viaggio salvato</span>
          <Link href="/viaggi" className={`${s.btn} ${s.ghost}`}>I miei viaggi</Link>
          <button type="button" className={`${s.btn} ${s.ghost}`} onClick={rimuovi} disabled={status === "busy"}>Rimuovi</button>
        </>
      ) : (
        <button type="button" className={s.btn} onClick={salva} disabled={status === "busy"}>
          {status === "busy" ? "Salvataggio…" : "Salva viaggio"}
        </button>
      )}
      {status === "error" && <span className={`${s.status} ${s.no}`}>Non è andata a buon fine. Ricarica la pagina e riprova.</span>}
    </div>
  );
}

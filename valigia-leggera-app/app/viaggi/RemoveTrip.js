"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import s from "@/components/viaggi.module.css";
import { createClient } from "@/lib/supabase/client";

export default function RemoveTrip({ id, name }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [armed, setArmed] = useState(false);

  async function onClick() {
    if (!armed) { setArmed(true); setTimeout(() => setArmed(false), 4000); return; }
    setBusy(true);
    const { error } = await createClient().from("saved_trips").delete().eq("id", id);
    setBusy(false); setArmed(false);
    if (!error) router.refresh();
  }

  return (
    <button type="button" className={`${s.btn} ${s.ghost}`} onClick={onClick} disabled={busy} aria-label={`Rimuovi ${name}`}>
      {busy ? "Rimozione…" : armed ? "Sicuro? Tocca ancora" : "Rimuovi"}
    </button>
  );
}

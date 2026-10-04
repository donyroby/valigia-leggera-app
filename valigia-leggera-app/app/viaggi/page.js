import Link from "next/link";
import { redirect } from "next/navigation";
import s from "@/components/viaggi.module.css";
import TopBar from "@/components/TopBar";
import RemoveTrip from "./RemoveTrip";
import { ALL } from "@/lib/viaggi/dati";
import { calc, fmt, todayISO } from "@/lib/viaggi/calcoli";
import { daRiga, versoIndirizzo } from "@/lib/viaggi/parametri";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "I miei viaggi · Valigia Leggera" };

const PROFILI = { amici: "tra amici", coppia: "in coppia", famiglia: "in famiglia" };

export default async function ViaggiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/accedi?next=/viaggi");

  const { data: trips, error } = await supabase
    .from("saved_trips")
    .select("*")
    .order("date_out", { ascending: true });

  const today = todayISO();
  const items = (trips || []).map((row) => {
    const d = ALL.find((x) => x.id === row.destination_id);
    if (!d) return { row, missing: true };
    const p = daRiga(row);
    const r = calc(d, p);
    const budget = row.budget != null ? Number(row.budget) : undefined;
    return { row, r, p, href: `/meta/${d.id}?${versoIndirizzo({ ...p, budget })}`, past: p.date < today };
  });

  return (
    <div className={s.page}>
      <TopBar />
      <div className={s.summary}>
        <h1 className={s.pageTitle}>I miei viaggi</h1>
        <span>Salvati nel tuo account: li ritrovi su qualsiasi dispositivo</span>
      </div>

      {error && <p className={s.empty}>Non riesco a caricare i viaggi salvati. Ricarica la pagina tra poco.</p>}

      {!error && items.length === 0 && (
        <div className={s.empty}>
          <strong>Non hai ancora salvato nessun viaggio.</strong><br />
          <Link href="/">Cerca una meta</Link>, apri &quot;Dettagli e itinerario&quot; e usa &quot;Salva viaggio&quot;.
        </div>
      )}

      <div className={s.rows}>
        {items.map(({ row, r, p, href, past, missing }) => missing ? (
          <div key={row.id} className={s.rowcard}>
            <div><h3>{row.destination_name}</h3><small>Questa meta non è più disponibile.</small></div>
            <div />
            <RemoveTrip id={row.id} name={row.destination_name} />
          </div>
        ) : (
          <div key={row.id} className={`${s.rowcard} ${past ? s.over : ""}`}>
            <div>
              <h3>{r.d.name}</h3>
              <small>
                Da {r.dep.n} · {new Date(p.date + "T12:00:00").toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}
                {" "}· {p.nights} notti · {p.people} pers. · {PROFILI[p.profile]}{past ? " · data passata" : ""}
              </small>
            </div>
            <div className={s.pp}>{fmt(r.pp)}<small>a persona</small></div>
            <div className={s.rowActions}>
              <Link className={`${s.btn} ${s.ghost}`} href={href}>Apri</Link>
              <RemoveTrip id={row.id} name={r.d.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

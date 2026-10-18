"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import s from "@/components/viaggi.module.css";

// Intestazione comune alle pagine di viaggio
// Accanto al logo: "Accedi" per chi non è collegato, il segno "Premium" per chi lo è
function StatoAccount() {
  const [st, setSt] = useState(null); // null = in caricamento | {user, premium}
  const path = usePathname();
  useEffect(() => {
    const supabase = createClient();
    let vivo = true;
    const leggi = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        let premium = false;
        if (user) {
          const { data } = await supabase.from("premium").select("user_id").eq("user_id", user.id).maybeSingle();
          premium = !!data;
        }
        if (vivo) setSt({ user: !!user, premium });
      } catch { if (vivo) setSt({ user: false, premium: false }); }
    };
    leggi();
    const { data: sub } = supabase.auth.onAuthStateChange(() => leggi());
    return () => { vivo = false; sub?.subscription?.unsubscribe(); };
  }, []);
  if (!st) return <span className={s.accSlot} aria-hidden="true" />;
  if (!st.user) {
    if (path?.startsWith("/accedi")) return <span className={s.accSlot} aria-hidden="true" />;
    return <Link className={`${s.btn} ${s.sun} ${s.accBtn}`} href={`/accedi?next=${encodeURIComponent(path || "/")}`}>Accedi</Link>;
  }
  if (st.premium) {
    return (
      <Link className={s.premiumChip} href="/premium" title="Il tuo account è premium">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0l1.8 5.2L15 7l-5.2 1.8L8 14l-1.8-5.2L1 7l5.2-1.8z" /></svg>
        Utente premium
      </Link>
    );
  }
  return <Link className={s.premiumLink} href="/premium">Passa a Premium</Link>;
}

export default function TopBar() {
  return (
    <header className={`${s.top} ${s.noprint}`}>
      <Link href="/" className={s.brand}>
        <svg viewBox="0 0 26 23" aria-hidden="true">
          <rect x="9" y="1" width="8" height="6" rx="2" fill="none" stroke="var(--sun-ink)" strokeWidth="2" />
          <rect x="1.5" y="6" width="23" height="16" rx="3.5" fill="var(--sun)" stroke="var(--sun-ink)" strokeWidth="1.6" />
          <line x1="1.5" y1="12.5" x2="24.5" y2="12.5" stroke="var(--sun-ink)" strokeWidth="1.2" opacity=".55" />
          <rect x="10.5" y="6" width="5" height="16" fill="none" stroke="var(--sun-ink)" strokeWidth="1.2" opacity=".55" />
          <circle cx="6.5" cy="17.5" r="1.1" fill="var(--sun-ink)" />
          <circle cx="19.5" cy="17.5" r="1.1" fill="var(--sun-ink)" />
        </svg>
        Valigia Leggera
      </Link>
      <StatoAccount />
      <nav className={s.nav} aria-label="Sezioni">
        <Link href="/">Cerca</Link>
        <Link href="/lowcost">Low cost</Link>
        <Link href="/viaggi"><span className={s.long}>I miei viaggi</span><span className={s.short}>Viaggi</span></Link>
        <Link href="/salvadanaio">Salvadanaio</Link>
        <Link href="/profilo"><span className={s.long}>Account</span><span className={s.short}>Profilo</span></Link>
      </nav>
    </header>
  );
}

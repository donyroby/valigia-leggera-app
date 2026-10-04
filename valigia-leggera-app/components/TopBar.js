import Link from "next/link";
import s from "@/components/viaggi.module.css";

// Intestazione comune alle pagine di viaggio
export default function TopBar() {
  return (
    <header className={s.top}>
      <Link href="/cerca" className={s.brand}>
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
      <nav className={s.nav} aria-label="Sezioni">
        <Link href="/cerca">Cerca</Link>
        <Link href="/lowcost">Low cost</Link>
        <Link href="/viaggi"><span className={s.long}>I miei viaggi</span><span className={s.short}>Viaggi</span></Link>
        <Link href="/salvadanaio">Salvadanaio</Link>
        <Link href="/profilo"><span className={s.long}>Account</span><span className={s.short}>Profilo</span></Link>
      </nav>
    </header>
  );
}

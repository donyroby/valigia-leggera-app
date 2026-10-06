import Link from "next/link";

// Piè di pagina con i collegamenti alle pagine legali, uguale in tutto il sito
export default function Footer() {
  return (
    <footer className="site-footer">
      <nav aria-label="Informazioni legali">
        <Link href="/privacy">Privacy</Link>
        <Link href="/cookie">Cookie</Link>
        <Link href="/termini">Termini d&apos;uso</Link>
        <Link href="/affiliazioni">Link di affiliazione</Link>
      </nav>
      <p>© 2026 Valigia Leggera · Prezzi stimati, non offerte reali</p>
    </footer>
  );
}

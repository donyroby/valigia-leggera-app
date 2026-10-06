import Link from "next/link";
import Brand from "@/components/Brand";
import Footer from "@/components/Footer";

export const metadata = { title: "Pagina non trovata · Valigia Leggera" };

export default function NotFound() {
  return (
    <>
      <main className="card">
        <Brand />
        <h1>Questa pagina ha perso la coincidenza</h1>
        <p>
          L&apos;indirizzo che hai aperto non esiste, o la meta che cercavi non è (ancora) tra le nostre.
          Nessun problema: si riparte dalla ricerca.
        </p>
        <div className="actions">
          <Link className="btn" href="/">Cerca un viaggio</Link>
          <Link className="btn ghost" href="/lowcost">Idee low cost</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

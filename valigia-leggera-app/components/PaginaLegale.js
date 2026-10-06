import Brand from "@/components/Brand";
import Footer from "@/components/Footer";
import { LEGALE } from "@/lib/legale";

export default function PaginaLegale({ titolo, children }) {
  return (
    <>
      <main className="card legal">
        <Brand />
        <h1>{titolo}</h1>
        <p className="legal-date">Ultimo aggiornamento: {LEGALE.aggiornato}</p>
        {LEGALE.bozza && (
          <p className="legal-bozza">
            Bozza in revisione: questo testo sarà verificato da un professionista prima dell&apos;apertura al pubblico.
          </p>
        )}
        {children}
      </main>
      <Footer />
    </>
  );
}

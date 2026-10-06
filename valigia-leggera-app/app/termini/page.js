import Link from "next/link";
import PaginaLegale from "@/components/PaginaLegale";
import { LEGALE } from "@/lib/legale";

export const metadata = { title: "Termini d'uso · Valigia Leggera" };

export default function Termini() {
  const { titolare, email, etaMinima } = LEGALE;
  return (
    <PaginaLegale titolo="Termini d'uso">
      <p>
        Usando Valigia Leggera accetti questi termini. Sono scritti in modo semplice: se qualcosa non è chiaro, scrivici a{" "}
        <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <h2>Cos&apos;è Valigia Leggera</h2>
      <p>
        Valigia Leggera, gestito da {titolare}, è uno strumento gratuito per farsi un&apos;idea di quanto costa un viaggio e
        trovare mete adatte al proprio budget. Il servizio è in fase di prova e alcune funzioni possono cambiare.
      </p>
      <p>
        <strong>Non siamo un&apos;agenzia di viaggi</strong> e non vendiamo viaggi: non prenotiamo per te, non incassiamo
        pagamenti e non siamo parte dei contratti che concludi con compagnie aeree, strutture o altri fornitori.
      </p>

      <h2>Prezzi e itinerari sono stime</h2>
      <ul>
        <li>I prezzi mostrati sono <strong>stime</strong> calcolate in base a distanza, stagione e costo medio della vita. Non sono offerte reali e possono essere diversi dai prezzi che troverai sui siti di prenotazione.</li>
        <li>Gli itinerari sono <strong>suggerimenti</strong>: prima di partire verifica orari, aperture, prezzi dei biglietti e accessibilità dei luoghi.</li>
        <li>Documenti di viaggio, visti, vaccinazioni e condizioni di sicurezza delle destinazioni vanno sempre verificati sui canali ufficiali (per esempio il sito Viaggiare Sicuri del Ministero degli Esteri).</li>
      </ul>

      <h2>Prenotazioni sui siti partner</h2>
      <p>
        I link ti portano su siti di terzi. Prezzi, disponibilità, condizioni di cancellazione e assistenza dipendono dal
        partner e dalle sue condizioni. Alcuni link sono di affiliazione: trovi i dettagli nella pagina{" "}
        <Link href="/affiliazioni">Link di affiliazione</Link>.
      </p>

      <h2>Il tuo account</h2>
      <ul>
        <li>Per creare un account devi avere almeno {etaMinima} anni.</li>
        <li>L&apos;account è personale: non condividere il link magico ricevuto via email.</li>
        <li>Il salvadanaio è un promemoria: non muove denaro vero.</li>
        <li>Puoi eliminare l&apos;account in qualsiasi momento dalla pagina del profilo.</li>
      </ul>

      <h2>Uso corretto</h2>
      <p>
        Non usare il sito in modo da danneggiarlo o sovraccaricarlo (per esempio con richieste automatiche massive) e non
        cercare di accedere ai dati di altri utenti. In caso di abusi possiamo sospendere o eliminare l&apos;account.
      </p>

      <h2>Responsabilità</h2>
      <p>
        Facciamo il possibile perché le informazioni siano utili e aggiornate, ma non possiamo garantire che siano sempre
        complete o esatte, né che il sito sia sempre disponibile. Nei limiti consentiti dalla legge, non siamo responsabili
        di decisioni prese solo sulla base delle stime, né dei servizi forniti dai partner. Restano salvi i diritti che la
        legge riconosce ai consumatori.
      </p>

      <h2>Servizi a pagamento</h2>
      <p>
        Oggi Valigia Leggera è gratuito. Se in futuro introdurremo funzioni a pagamento, avranno condizioni di vendita
        separate, che potrai leggere prima di qualsiasi acquisto.
      </p>

      <h2>Modifiche e legge applicabile</h2>
      <p>
        Possiamo aggiornare questi termini: la data in cima alla pagina indica l&apos;ultima versione, e per i cambiamenti
        importanti avviseremo chi ha un account. Si applica la legge italiana; per i consumatori resta competente il foro del
        luogo di residenza.
      </p>
      <p>Vedi anche: <Link href="/privacy">Informativa privacy</Link> · <Link href="/cookie">Cookie</Link>.</p>
    </PaginaLegale>
  );
}

import Link from "next/link";
import PaginaLegale from "@/components/PaginaLegale";
import { LEGALE } from "@/lib/legale";

export const metadata = { title: "Informativa privacy · Valigia Leggera" };

export default function Privacy() {
  const { titolare, tipoTitolare, email, etaMinima } = LEGALE;
  return (
    <PaginaLegale titolo="Informativa privacy">
      <p>
        Questa pagina spiega quali dati personali raccoglie Valigia Leggera, perché, dove li conserva e quali sono i tuoi
        diritti, come previsto dal Regolamento europeo sulla protezione dei dati (GDPR, art. 13).
      </p>

      <h2>Chi è il titolare</h2>
      <p>
        Il titolare del trattamento è <strong>{titolare}</strong> ({tipoTitolare}). Per qualsiasi domanda o richiesta
        sui tuoi dati puoi scrivere a <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <h2>Quali dati raccogliamo</h2>
      <p>Puoi usare la ricerca, le schede delle mete e le idee low cost senza account e senza darci alcun dato personale. Se crei un account conserviamo:</p>
      <ul>
        <li><strong>Email</strong>, per farti accedere con il link magico.</li>
        <li><strong>Dati tecnici dell&apos;account</strong>: data di creazione, ultimo accesso e le informazioni tecniche che i sistemi di accesso e di hosting registrano per sicurezza (per esempio indirizzo IP e tipo di browser).</li>
        <li><strong>Profilo</strong>: il nome con cui vuoi essere chiamato, se lo inserisci, e con chi viaggi di solito.</li>
        <li><strong>Viaggi salvati</strong>: meta, aeroporto di partenza, date, numero di persone, numero ed età dei bambini (senza nomi), budget e preferenze del viaggio.</li>
        <li><strong>Salvadanaio</strong>: le cifre che inserisci, l&apos;obiettivo e la cifra mensile. Sono solo promemoria: Valigia Leggera non gestisce denaro.</li>
      </ul>
      <p>
        Le ultime scelte della ricerca vengono ricordate solo nel tuo browser, per comodità, e non ci vengono inviate.
        Non raccogliamo dati di pagamento, non usiamo strumenti di profilazione pubblicitaria e non vendiamo dati a nessuno.
      </p>

      <h2>Perché li usiamo e su quale base</h2>
      <ul>
        <li><strong>Fornirti il servizio</strong> che hai chiesto (account, viaggi salvati, salvadanaio, email di accesso): base giuridica l&apos;esecuzione del servizio richiesto (art. 6.1.b GDPR).</li>
        <li><strong>Sicurezza e prevenzione degli abusi</strong> (registri tecnici, limiti all&apos;invio delle email): legittimo interesse a proteggere il servizio e gli utenti (art. 6.1.f).</li>
        <li><strong>Obblighi di legge</strong>, se e quando applicabili (art. 6.1.c).</li>
      </ul>
      <p>
        Non ti mandiamo newsletter né comunicazioni promozionali. Se in futuro introdurremo notifiche con proposte di viaggio,
        le invieremo solo con il tuo consenso esplicito, che potrai ritirare in qualsiasi momento.
      </p>

      <h2>Chi tratta i dati per nostro conto</h2>
      <p>Usiamo fornitori esterni, nominati responsabili del trattamento, solo per quanto serve a far funzionare il sito:</p>
      <ul>
        <li><strong>Supabase</strong>: database e sistema di accesso, con i dati conservati su server in Irlanda (Unione europea).</li>
        <li><strong>Netlify</strong>: hosting del sito, con sede negli Stati Uniti. Gli eventuali trasferimenti fuori dall&apos;Unione europea avvengono sulla base delle garanzie previste dal GDPR, come le decisioni di adeguatezza o le clausole contrattuali standard.</li>
        <li><strong>Brevo</strong>: invio delle email di accesso, azienda con sede in Francia (Unione europea).</li>
      </ul>

      <h2>Link ai siti partner</h2>
      <p>
        Le schede delle mete contengono link a siti di prenotazione (voli, alloggi, esperienze). Quando li apri passi sul sito
        del partner, che tratta i tuoi dati secondo la propria informativa. Noi non trasmettiamo ai partner la tua email né altri
        tuoi dati personali; alcuni link contengono solo un codice che identifica Valigia Leggera, come spiegato nella
        pagina <Link href="/affiliazioni">Link di affiliazione</Link>.
      </p>

      <h2>Per quanto tempo</h2>
      <p>
        Conserviamo i dati dell&apos;account finché l&apos;account esiste. Quando lo elimini dalla pagina del profilo,
        cancelliamo subito email, profilo, viaggi salvati e salvadanaio. I registri tecnici dei fornitori vengono conservati per
        il periodo limitato previsto dai loro sistemi di sicurezza.
      </p>

      <h2>I tuoi diritti</h2>
      <p>
        Hai diritto di accedere ai tuoi dati, correggerli, cancellarli, chiederne la limitazione, opporti al trattamento basato
        sul legittimo interesse e ricevere i dati in un formato strutturato (portabilità). Due di questi li puoi esercitare
        direttamente dalla <Link href="/profilo">pagina del profilo</Link>: <strong>Scarica i miei dati</strong> ed{" "}
        <strong>Elimina il mio account</strong>. Per tutto il resto scrivi a <a href={`mailto:${email}`}>{email}</a>:
        rispondiamo entro un mese.
      </p>
      <p>
        Se ritieni che i tuoi dati siano trattati in modo non corretto, puoi presentare reclamo al Garante per la protezione
        dei dati personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">garanteprivacy.it</a>).
      </p>

      <h2>Età minima</h2>
      <p>
        Per creare un account devi avere almeno {etaMinima} anni. Se ci accorgiamo che un account appartiene a una persona
        più giovane, lo eliminiamo.
      </p>

      <h2>Dati obbligatori e decisioni automatiche</h2>
      <p>
        L&apos;email è necessaria per creare l&apos;account; senza, puoi comunque usare la ricerca. I prezzi e gli itinerari
        sono calcolati in automatico, ma sono solo stime e suggerimenti: non producono decisioni con effetti giuridici su di te.
      </p>

      <h2>Modifiche</h2>
      <p>
        Se cambieremo questa informativa aggiorneremo la data in cima alla pagina; per i cambiamenti importanti avviseremo
        chi ha un account.
      </p>
      <p>Vedi anche: <Link href="/cookie">Cookie</Link> · <Link href="/termini">Termini d&apos;uso</Link>.</p>
    </PaginaLegale>
  );
}

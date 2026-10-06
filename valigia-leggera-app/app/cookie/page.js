import Link from "next/link";
import PaginaLegale from "@/components/PaginaLegale";

export const metadata = { title: "Cookie · Valigia Leggera" };

export default function Cookie() {
  return (
    <PaginaLegale titolo="Cookie e memoria del browser">
      <p>
        Valigia Leggera usa solo strumenti <strong>tecnici</strong>, necessari a far funzionare il sito. Non usiamo cookie
        pubblicitari, di profilazione o di statistica, e non carichiamo contenuti di terze parti che ne installano (anche i
        caratteri tipografici sono ospitati sul nostro sito). Per questo non ti chiediamo il consenso con un banner.
      </p>

      <h2>Cosa usiamo</h2>
      <div className="legal-table">
        <table>
          <thead>
            <tr><th>Nome</th><th>Tipo</th><th>A cosa serve</th><th>Durata</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>sb-…-auth-token</code></td>
              <td>Cookie tecnico</td>
              <td>Ti mantiene collegato al tuo account dopo il link magico. Esiste solo se fai l&apos;accesso.</td>
              <td>Fino all&apos;uscita dall&apos;account o alla scadenza della sessione</td>
            </tr>
            <tr>
              <td><code>vl2.cerca</code>, <code>vl2.lowcost</code></td>
              <td>Memoria del browser (localStorage)</td>
              <td>Ricorda le ultime scelte di ricerca e delle idee low cost su questo dispositivo. Non ci vengono inviate.</td>
              <td>Finché non le cancelli dal browser o elimini l&apos;account</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Siti dei partner</h2>
      <p>
        Quando apri un link verso un sito di prenotazione (voli, alloggi, esperienze), quel sito può usare i propri cookie,
        anche per riconoscere che arrivi da Valigia Leggera. Sono regolati dall&apos;informativa del partner, che trovi sul
        suo sito. Maggiori dettagli nella pagina <Link href="/affiliazioni">Link di affiliazione</Link>.
      </p>

      <h2>Come cancellarli</h2>
      <p>
        Puoi cancellare cookie e memoria del sito dalle impostazioni del browser in qualsiasi momento. Cancellando il cookie
        di accesso dovrai solo chiedere un nuovo link per entrare.
      </p>
      <p>
        Se in futuro aggiungeremo strumenti non tecnici, come statistiche di terze parti, aggiorneremo questa pagina e, dove
        richiesto, chiederemo il tuo consenso prima di attivarli.
      </p>
      <p>Vedi anche: <Link href="/privacy">Informativa privacy</Link>.</p>
    </PaginaLegale>
  );
}

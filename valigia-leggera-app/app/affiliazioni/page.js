import Link from "next/link";
import PaginaLegale from "@/components/PaginaLegale";

export const metadata = { title: "Link di affiliazione · Valigia Leggera" };

export default function Affiliazioni() {
  return (
    <PaginaLegale titolo="Link di affiliazione">
      <p>
        Valigia Leggera è gratuito. Per sostenerlo, alcuni link verso i siti di prenotazione sono <strong>link di
        affiliazione</strong>: se prenoti dopo averli aperti, il partner può riconoscere a Valigia Leggera una piccola
        commissione. <strong>Per te il prezzo non cambia.</strong>
      </p>

      <h2>Quali link</h2>
      <p>Oggi sono di affiliazione, tramite il programma Travelpayouts, i link verso:</p>
      <ul>
        <li><strong>Aviasales</strong>, per voli e alloggi;</li>
        <li><strong>KKday</strong>, per tour ed esperienze;</li>
        <li><strong>intui.travel</strong>, per i transfer dall&apos;aeroporto;</li>
        <li><strong>Go City</strong>, per i pass delle attrazioni.</li>
      </ul>
      <p>
        Gli altri link (per esempio Skyscanner, Google Voli, Kayak, Booking.com, Airbnb, Trenitalia, Italo, Trainline,
        Omio, FlixBus e Google Maps) oggi non ci portano commissioni: li proponiamo perché sono utili. L&apos;elenco può
        cambiare, e questa pagina verrà aggiornata.
      </p>

      <h2>Le commissioni non decidono le mete</h2>
      <p>
        Le mete, i prezzi stimati e l&apos;ordine dei risultati dipendono solo dai tuoi parametri (partenza, date, persone,
        budget) e non dalle commissioni. Accanto ai partner affiliati mostriamo sempre anche alternative non affiliate.
      </p>

      <h2>Cosa succede quando apri un link</h2>
      <p>
        Il link contiene un codice che identifica Valigia Leggera, non te: non comunichiamo al partner la tua email né altri
        tuoi dati. Sul sito del partner valgono la sua informativa privacy e i suoi cookie.
      </p>
      <p>Vedi anche: <Link href="/privacy">Informativa privacy</Link> · <Link href="/termini">Termini d&apos;uso</Link>.</p>
    </PaginaLegale>
  );
}

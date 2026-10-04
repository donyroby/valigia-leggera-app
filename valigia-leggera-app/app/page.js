import Link from "next/link";
import Brand from "@/components/Brand";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="card">
      <Brand />
      <h1>La versione vera è in costruzione</h1>
      <p>
        Stiamo ricostruendo l&apos;app con un database vero, account utente e prezzi
        reali. Nel frattempo, il prototipo con tutte le funzioni è già online e si
        può provare.
      </p>
      <div className="actions">
        <a className="btn" href="https://claude.ai/artifact/2h77SRDg2K3V5cHgy6beyj" target="_blank" rel="noopener noreferrer">
          Prova il prototipo
        </a>
        <a className="btn ghost" href="https://donyroby.github.io" target="_blank" rel="noopener noreferrer">
          Leggi gli articoli
        </a>
      </div>
      <p className="account-line">
        Novità in costruzione: <Link href="/cerca">prova la nuova ricerca</Link>, con le stesse mete e gli stessi calcoli del prototipo.
      </p>
      <p className="account-line">
        {user ? (
          <>
            Hai fatto l&apos;accesso come <strong>{user.email}</strong>.{" "}
            <Link href="/profilo">Vai al tuo profilo</Link>
          </>
        ) : (
          <>
            Vuoi provare gli account? <Link href="/accedi">Accedi con la tua email</Link>
          </>
        )}
      </p>
    </main>
  );
}

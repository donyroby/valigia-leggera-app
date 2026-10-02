export default function Home() {
  return (
    <main className="card">
      <div className="brand">
        <svg viewBox="0 0 26 23" aria-hidden="true">
          <rect x="9" y="1" width="8" height="6" rx="2" fill="none" stroke="var(--sun-ink)" strokeWidth="2" />
          <rect x="1.5" y="6" width="23" height="16" rx="3.5" fill="var(--sun)" stroke="var(--sun-ink)" strokeWidth="1.6" />
          <line x1="1.5" y1="12.5" x2="24.5" y2="12.5" stroke="var(--sun-ink)" strokeWidth="1.2" opacity=".55" />
          <rect x="10.5" y="6" width="5" height="16" fill="none" stroke="var(--sun-ink)" strokeWidth="1.2" opacity=".55" />
          <circle cx="6.5" cy="17.5" r="1.1" fill="var(--sun-ink)" />
          <circle cx="19.5" cy="17.5" r="1.1" fill="var(--sun-ink)" />
        </svg>
        Valigia Leggera
      </div>
      <h1>La versione vera è in costruzione</h1>
      <p>
        Stiamo ricostruendo l&apos;app con un database vero, account utente e prezzi
        reali. Nel frattempo, il prototipo con tutte le funzioni è già online e si
        può provare.
      </p>
      <a className="btn" href="https://claude.ai/artifact/2h77SRDg2K3V5cHgy6beyj" target="_blank" rel="noopener noreferrer">
        Prova il prototipo
      </a>
      <a className="btn ghost" href="https://donyroby.github.io" target="_blank" rel="noopener noreferrer">
        Leggi gli articoli
      </a>
      <p className="note">Pagina di avvio del progetto — questa riga sparirà appena ci sarà contenuto vero.</p>
    </main>
  );
}

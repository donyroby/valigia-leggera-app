# Valigia Leggera — app

Progetto Next.js. Deploy automatico su Netlify a ogni push su `main`.

## Variabili d'ambiente (impostate su Netlify)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Pagine
- `/` pagina iniziale
- `/accedi` accesso con link magico via email
- `/profilo` nome e profilo di viaggio preferito (tabella `profiles`)
- `/meta/[id]` scheda della meta (costi, itinerario di base, link ai partner, salvataggio)
- `/viaggi` viaggi salvati dell'utente (tabella `saved_trips`)
- `/cerca` ricerca delle mete (dati e calcoli in `lib/viaggi`, presi dal prototipo)

## Verifica dei calcoli
`npm run verifica` confronta i calcoli dell'app con quelli del prototipo
(copia di riferimento in `scripts/prototipo-riferimento.js`), meta per meta.

## Sviluppo locale
```
npm install
npm run dev
```

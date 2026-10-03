# Valigia Leggera — app

Progetto Next.js. Deploy automatico su Netlify a ogni push su `main`.

## Variabili d'ambiente (impostate su Netlify)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Pagine
- `/` pagina iniziale
- `/accedi` accesso con link magico via email
- `/profilo` nome e profilo di viaggio preferito (tabella `profiles`)

## Sviluppo locale
```
npm install
npm run dev
```

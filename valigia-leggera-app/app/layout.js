import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/dm-sans";
import "./globals.css";

const SITO = "https://valigialeggera.it";
const TITOLO = "Valigia Leggera · Dove ti porta il tuo budget?";
const DESCRIZIONE =
  "Scegli da dove parti, le date e quanto vuoi spendere a persona: Valigia Leggera ti mostra le mete in Italia, in Europa e nel mondo che stanno nel tuo budget.";

export const metadata = {
  metadataBase: new URL(SITO),
  title: TITOLO,
  description: DESCRIZIONE,
  applicationName: "Valigia Leggera",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: SITO,
    siteName: "Valigia Leggera",
    title: TITOLO,
    description: DESCRIZIONE,
  },
  twitter: { card: "summary_large_image", title: TITOLO, description: DESCRIZIONE },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EDF3F5" },
    { media: "(prefers-color-scheme: dark)", color: "#0A1B2D" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
